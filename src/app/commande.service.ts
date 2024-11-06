import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { Firestore , collection , addDoc ,collectionData,
  doc, updateDoc , getDoc ,deleteDoc,
  query,
  orderBy
 } from '@angular/fire/firestore';
import { lignePanier } from '../models/lignePanier';
import { commande } from '../models/commande';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  

  constructor(private authService : AuthService , private firestore : Firestore) {
   }


   async addCommande( dateCommande: Date, details: lignePanier[], montant: number) {
    const userId = await this.authService.getUserId();
    console.log("userID",userId)
    if(userId){
    const commandeData: commande = {
      userId: userId,
      dateCommande: dateCommande,
      details: details,
      montant: montant
    }
  ;
  
    const collectionInstance = collection(this.firestore, 'orders');
    addDoc(collectionInstance, commandeData)
      .then(() => console.log("Order successfully added!"))
      .catch(error => console.error('Error adding order:', error)); // Log the error message
  }
}
  

   getAllOrders() {
    const collectionInstance = collection(this.firestore, 'orders');
    return collectionData(collectionInstance ,{idField :'id'});
  }
  

  getOrderId(id: string) {

    const collectionInstance = collection(this.firestore,'orders') ;
    const docinstance = doc(this.firestore,'orders',id) ; 
    return getDoc(docinstance) ; 
    
  }

  updateOrder(id: string){
    const docinstance = doc (this.firestore,'products',id)
    const updatedOrder : any = {name : "updated name" }
    updateDoc(docinstance,updatedOrder)
    .then(() => console.log(`Order with ${id} updated successfully !`))
    .catch(error => console.log(error))
  }

  deleteOrder(id:string){
    const docinstance = doc(this.firestore,'orders',id)
    deleteDoc(docinstance)
    .then(()=>console.log('data deleted !'))
    .catch(error=>console.log(error))
  }


  getUserOrders(userId: string): Observable<commande[]> {
    const collectionInstance = collection(this.firestore, 'orders');
    const q = query(
      collectionInstance,
      orderBy('dateCommande', 'desc') // Trier par dateCommande, les plus récentes en premier
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map((orders: commande[]) =>
        orders
          .filter(order => order.userId === userId) // Filtrer les commandes pour cet utilisateur
          .map(order => ({
            ...order,
            dateCommande: (order.dateCommande as any).toDate() // Convertir le timestamp en Date
          }))
      )
    );
  }
  

  

   

  


}
