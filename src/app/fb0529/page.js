"use client"
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useEffect } from "react";


export default function FB0529() {
  const firebaseConfig = {
    apiKey: "AIzaSyDPkJFxylPd0ws9Y3Q-XIzIo4hq_BrYsaA",
    authDomain: "nccu-11302.firebaseapp.com",
    projectId: "nccu-11302",
    storageBucket: "nccu-11302.firebasestorage.app",
    messagingSenderId: "783334160010",
    appId: "1:783334160010:web:5d1b4b2193f1d495e09f73",
    databaseURL:"https://nccu-11302-default-rtdb.firebaseio.com/"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dbRef = ref(database, "/");

  const auth = getAuth();
  const provider = new GoogleAuthProvider(); 


  useEffect(()=>{

    onValue(dbRef, (snapshot)=>{
      console.log( snapshot.val() );
    });

    const userRef = ref(database, "/accounts/0000001/");
    
    set(userRef, {
      name: "GUGU",
      points: 200
    });

  }, []);


  const addNewAccount = () => {
    console.log("clicked");
    const accountRef = ref(database, "/accounts");

    push(accountRef, {
      name: "Wang",
      type: "User",
      point: "10"
    });

  }

  const login = ()=> {

    signInWithPopup(auth, provider).then((result)=>{
      console.log(result);
      console.log(result.user.uid);
      console.log(result.user.displayName);

      const uid = result.user.uid;
      const name= result.user.displayName;

      const accountRef = ref(database, "/accounts/"+ uid);
      console.log(accountRef);

      if(!accountRef){
         //有此帳號


      }else{
        //沒有此帳號，建立一個
        push(accountRef, {
          name: name,
          type: "User",
          point: "10",
          uid:uid
        });
      }


    });

  }



  return (
    <>
      fb0529
      <div onClick={ addNewAccount } className="text-black border-black border-2 px-4 py-1 inline-block ">Add new Acoount</div>
      <div onClick={ login } className="text-black border-black border-2 px-4 py-1 inline-block ">Login with GOOGLE</div>
    </>
  );
}