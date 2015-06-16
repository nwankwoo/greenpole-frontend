package org.greenpole.controller.usermanagement;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpSession;
import org.greenpole.entity.model.user.User;
import org.greenpole.util.Utility;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm) 
 */
@Controller
public class UserManagement {
    
    /**
     * Controller for creating new users
     * @param user
     * @param key
     * @param hole
     * @param util
     * @param session
     * @return 
     */
    @RequestMapping(value={"createNewUser"},method=RequestMethod.POST)
    public @ResponseBody String createNewUser(@ModelAttribute User user,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session){
        String response="";
        try{
           if(util.validateViewMapping(key, hole, "createNewUser", session))  {
                user.setUsername(user.getUsername().toLowerCase());
                System.out.println(util.convertObjectToJSONString(user));
                response="New user created successfully.";
            } 
        }catch(IOException ex){
            ex.printStackTrace();
            response="Encountered error while trying to create user.";
        }
        
        return response;
    }
    
   @RequestMapping(value={"getUserList"},method=RequestMethod.GET)
   public @ResponseBody List getUserList(@RequestParam (value="pageSize",required=true ) int pageSize,
           @RequestParam (value="page",required=false ) Object page){
       int offset=0;
       
       if(page!=null){
           int _page=Integer.parseInt(page.toString());
           offset=Math.abs(_page-1) * pageSize;
       }
       int start=offset;
       int end=offset+pageSize;
       
       List <User> userList = new ArrayList();
       
       /*userList.add(new User("Samsudeen","Babashola","Yusuf","samsudeen.yusuf@africaprudentialregistrarsplc.com","IT","Software Development"));
       userList.add(new User("Ahmad","Alabi","Gbadamosi","ahmad.gbadamosi@africaprudentialregistrarsplc.com","IT","Software Development"));
       userList.add(new User("Akinwale","Chukwuemeka","Agbaje","akinwale.agbaje@africaprudentialregistrarsplc.com","IT","Software Development"));
       userList.add(new User("Olusola","Pius","Oginni","olusola.oginni@africaprudentialregistrarsplc.com","IT","Software Development"));
       userList.add(new User("Emmanuel","","Idoko","emmanuel.idoko@africaprudentialregistrarsplc.com","IT","Software Development"));
       userList.add(new User("Jephta","Ayo","Sadare","jephta.sadare@africaprudentialregistrarsplc.com","IT","Software Development"));
       userList.add(new User("Adebo","","Okunade","adebo.okunade@africaprudentialregistrarsplc.com","IT","General Service"));
       userList.add(new User("Dominic","","Eneche","dominic.eneche@africaprudentialregistrarsplc.com","IT","General Support"));
       userList.add(new User("Nawok","F","Gutau","nawok.gutau@africaprudentialregistrarsplc.com","Operation","Customer Services"));
       userList.add(new User("Peter","","Ashade","peter.ashade@africaprudentialregistrarsplc.com","Administration","Administration"));
       userList.add(new User("Omoniyi","","Edward","omoniyi.edward@africaprudentialregistrarsplc.com","Human Capital Management","Human Resource Management"));
       userList.add(new User("Catherine","","Nwosu","catherine.nwosu@africaprudentialregistrarsplc.com","Operations","Operations"));
       userList.add(new User("Opeyemi","","Onifade","opeyemi.onifade@africaprudentialregistrarsplc.com","Strategic Business Management","SBT"));
       userList.add(new User("Feyisara","","Oseni","feyisara.oseni@africaprudentialregistrarsplc.com","Corporate Resources","Reception"));
       userList.add(new User("Musa","","Bello","musa.bello@africaprudentialregistrarsplc.com","Legal & Compliance","Legal"));
       userList.add(new User("Chisom","","Onyejiuwa","chisom.onyejiuwa@africaprudentialregistrarsplc.com","Corporate Resources","General Services"));
       System.out.println("size="+userList.size()+" page size="+pageSize);*/
       if(end>userList.size())
           end=userList.size();
       
       List<User> subUserList = new ArrayList();
       int i=0;
       for(int k=start;k<end;k++){
           subUserList.add(userList.get(k));
       }
       double size=userList.size();
       int numOfPage=(int)Math.ceil(size/pageSize);
       Set pageList=new HashSet();
       for(int j=1;j<=numOfPage;j++){
           pageList.add(j);
       }
          
       List returnUserList=new ArrayList();
       returnUserList.add(pageList);
       returnUserList.add(subUserList);
       returnUserList.add(userList.size());
       
       return returnUserList;
   }
}
