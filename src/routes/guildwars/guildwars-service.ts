import { Log } from "../../logger.js";
import { GuildWarsInventory, GuildWarsInventoryItem } from "../../types/guildwars.types.js";
import { getCharacters, getCharactersInventory } from "./api/guildwars-api.js"

export const getAllItems = async () => {
    const characterNames = await getCharacters()

    let items: Array<GuildWarsInventoryItem> = []
    for(let account = 0; account < characterNames.length - 1; account++) {
        const accountNames = characterNames[account];
        const inventories: Array<GuildWarsInventory> = await runParalel(getCharactersInventory, accountNames.map((name) => { return {account, name }}))
        inventories.forEach(inventory => {
            inventory.bags.forEach(bag => {
                if (bag) {
                    bag.inventory.forEach(item => {
                        if (item) {
                            items.push(item)
                        }
                    })
                }
            })
        })
    }

    return items;
}

export const runParalel = async <T, G>(func: (value: T) => Promise<G>, list: Array<T>): Promise<Array<G>> => {
    const parallel = [0, 1, 2]
    return new Promise(resolve => {
        const ret: Array<G> = [];
        let times = 0;

        parallel.forEach(async () => {
            let finish = false;

            do {
                const value = list.pop();
                finish = await new Promise((resolve) => {
                    if (value === undefined) {
                        resolve(true);
                        return;
                    }
                    func(value).then((func_value: G) => {
                        ret.push(func_value)
                    })
                })


            } while(finish)
            times++;
            if(times === parallel.length)
                resolve(ret)
        })  
    })
}