import { useDashBoardStore } from "../store/dashboard";
import { useLogInStore } from "../store/login";


export default function useCheckFeatures(feature_name) {
    const role_features = useDashBoardStore((state)=>state.app_role_features)
    const user_roles = useLogInStore((state)=>state.roles)
    if (user_roles.indexOf("superuser") >-1){
        return true
    }

    let result = false
    if (user_roles != null ){       
        for (let key of user_roles) {    
            if (role_features != null && key != null && role_features?.[key] != null){       
                if (role_features?.[key].indexOf(feature_name) > -1){
                    result = true
                    break;
                }
            }
            
        }  
    }
    return result
}