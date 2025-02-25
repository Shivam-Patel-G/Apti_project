import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null)


export const AuthContextProvider = ({children}) => {

    const [user,setUser] = useState(null)

   

    
    return(
        <AuthContext.Provider value={{
            user,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}