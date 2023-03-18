export class ObjectSubMenu {
    Menu_ParentMenu?: string;
    idMenu: number;
    MenuName: string;
    ParentMenu: number;
    OptionMenu: string;
    OptionPath: string;
    Id: number;

    constructor(data:any) {

        this.Id = data.id || 0;
        this.MenuName = data.MenuName || '';
        this.Menu_ParentMenu = data.Menu_ParentMenu || '';
        this.OptionMenu = data.OptionMenu || '';
        this.OptionPath = data.OptionPath || '';
        this.ParentMenu = data.ParentMenu || 0;
        this.idMenu = data.idMenu || 0;

    }
}
