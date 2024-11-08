import { auth } from '@/config/Firebase';
import { AppContext } from '@/src/context/AppContext';
import React, { useContext, useEffect } from 'react'

export default function Layout({ children }) {
    const { dispatch } = useContext(AppContext);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            dispatch({
                type: "UPDATE_USER",
                payload: user
              });
          
        });
    
        // Clean up the subscription when the component is unmounted
        return () => unsubscribe();
      }, []); 

    return (
        <main>
            {children}
        </main>
    )
}
