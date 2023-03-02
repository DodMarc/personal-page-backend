export interface GuildWarsItem {
    id: number;
    name: string;
    icon: string;
    type: string;
  }
  
  export interface GuildWarsInventory {
    bags: Array<GuildWarsBag | null>;
  }
  
  export interface GuildWarsBag {
    id: number;
    size: number;
    inventory: Array<GuildWarsInventoryItem | null>;
  }
  
  export interface GuildWarsInventoryItem {
    id: number;
    count: number;
    owner?: string;
  }
  