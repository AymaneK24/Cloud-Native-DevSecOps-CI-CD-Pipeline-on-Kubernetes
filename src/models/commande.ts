import { lignePanier } from "./lignePanier";

export class commande {
    userId !: string ;
    dateCommande !: Date ;
    details !: Array<lignePanier>;
    montant !: number ;

    constructor(userId : string , dateCommande : Date , details : Array<lignePanier> ){
        this.userId = userId ;
        this.dateCommande = dateCommande ; 
        this.details = details ;
        
    }

    

}