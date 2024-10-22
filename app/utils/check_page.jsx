import { useDashBoardStore } from "../store/dashboard";
import { useLogInStore } from "../store/login";


export default function useCheckPage(page_name) {
    const role_pages = useDashBoardStore((state)=>state.role_pages)
    const user_roles = useLogInStore((state)=>state.roles)

    let result = false
    if (user_roles != null ){       
        for (let key of user_roles) {  
            // console.log(role_pages?.[key])  
            if (role_pages != null && key != null && role_pages?.[key] != null){       
                if (role_pages?.[key].indexOf(page_name) > -1){
                    result = true
                    break;
                }
            }
        }  
    }else{
        if(role_pages?.["Anonymous"].indexOf(page_name) > -1){
            result = true
        }
    }
    return result
}