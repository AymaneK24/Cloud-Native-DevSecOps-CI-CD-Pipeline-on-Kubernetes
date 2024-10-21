import { product } from "./product";

export class lignePanier{

    public produit!:product;
    public qte!: number;
    
    constructor(produit:product,qte:number){
        this.produit =produit
        this.qte = qte
    }
   
}

