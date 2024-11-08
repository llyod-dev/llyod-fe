// withAuthProtection.js
import { getIdFromLocalCookie, getUserFromLocalCookie } from '@/lib/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuthProtection = (WrappedComponent) => {
    const ComponentWithAuth = (props) => {
        const router = useRouter();

        useEffect(() => {
            const getUserId = async () => {
              const userID = await getIdFromLocalCookie();
              console.log("UserId: ", userID);
          
              if (userID == null || userID == undefined) {
                router.push('/sign-in');
              }
            };
          
            getUserId();
          }, []);
          


        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuthProtection;
