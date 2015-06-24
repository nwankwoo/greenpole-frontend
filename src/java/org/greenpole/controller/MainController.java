package org.greenpole.controller;

import java.net.URI;
import org.greenpole.util.Utility;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;
import javax.crypto.KeyGenerator;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.greenpole.entity.notification.NotificationWrapper;
import org.greenpole.entity.response.Response;
import org.greenpole.model.profiler.Profiler;
import org.greenpole.model.profiler.UserProfile;
import org.greenpole.util.DataStore;
import org.greenpole.util.ServiceEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;



/**
 *
 * @author Samsudeen.Yusuf
 */
@Controller
@SessionAttributes("company_name")
public class MainController  {
    
    /**
     * This method responsible for rendering the login view
     * @param error
     * @param expire
     * @param logout
     * @param loginModelMap
     * 
     * @return
     */
    @Autowired
    ServletContext context;
    @RequestMapping(value={"login"},method=RequestMethod.GET)    
    public ModelAndView getLoginView(@RequestParam (value="error",required=false) String error,
            @RequestParam (value="expire",required=false) String expire,
            @RequestParam (value="logout",required=false) String logout,
            ModelMap loginModelMap,HttpSession httpSession){
        ModelAndView mv=new ModelAndView();  
        mv.setViewName("login");
        if(error!=null){
            mv.setViewName("login");
            loginModelMap.put("login_status","false");
        }
        if(expire!=null){
            loginModelMap.put("login_status","session_expire");
        }
        if(logout!=null){
            loginModelMap.put("login_status","logout");
        }
        //System.out.println(DataStore.getServiceURL(httpSession));
        return mv;
    }
    
    /**
     * This method is responsible for rendering the login view
     * @param profiler
     * @param session
     * @param loginModelMap
     * @param serviceEngine
     * @param util
     * @param dataStore
     * @return
     * @throws Exception 
     */
    @RequestMapping(value={"/","index"},method=RequestMethod.GET)
    public ModelAndView getIndex(Profiler profiler,HttpSession session,ModelMap loginModelMap,ServiceEngine serviceEngine,Utility util,
            DataStore dataStore) throws Exception{
        ModelAndView mv=new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Response response = serviceEngine.sendGeneralRequest(session, null, ServiceEngine.GET_NOTIFICATIONS);
        List<NotificationWrapper> notifications = (List<NotificationWrapper>) response.getBody();
        if(notifications == null){
            notifications = new ArrayList();
        }
        System.out.println(util.convertObjectToJSONString(notifications));
        mv.addObject("notification", notifications);
        for(NotificationWrapper notification : notifications){
            if(notification.getMessageTag().contains("Authorisation")){
                notification.setMessageTag("Authorisation Request From "+notification.getFrom());
            }
            
        }
        dataStore.saveObject("notifications", notifications, session);
        mv.addObject("company_name", "Africa Prudential Registrars Plc.");
        UserProfile userprofile=null;
        mv.addObject("username",auth.getName());
        if(session.getAttribute("userprofile")==null){
            profiler.setRole(auth.getAuthorities().toArray()[0].toString());
            userprofile=profiler.getUserProfile(); 
            session.setAttribute("userprofile", userprofile);
        }
        else{
            userprofile=(UserProfile) session.getAttribute("userprofile");
        }
        
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");

        keyGenerator.init(128);
        Key secretKey = keyGenerator.generateKey();
        
        dataStore.saveObject("oilKey", secretKey, session);
        
        mv.addObject("userprofile", userprofile.getUser());
        mv.addObject("viewList", userprofile.getViews());
        mv.setViewName("index");        
        return mv;
    }
    
    /**
     * This method is responsible for resolving views for user
     * @param key
     * @param hole
     * @param session
     * @param profiler
     * @return 
     */
    @RequestMapping(value={"/pole"},method=RequestMethod.GET)
    public ModelAndView poleResolver(@RequestParam (value="key",required=true ) String key,
                                     @RequestParam (value="hole",required=true) String hole,
                                     HttpSession session,Profiler profiler){
        ModelAndView mv=new ModelAndView();
        try{
            UserProfile userprofile=(UserProfile) session.getAttribute("userprofile");
            String viewname=userprofile.getViews().get(hole).getViewList().get(key).getViewName().trim();
            String viewtitle=userprofile.getViews().get(hole).getViewList().get(key).getViewTitle();  
            String viewModel=userprofile.getViews().get(hole).getViewList().get(key).getViewModel().trim();
            mv.addObject("viewtitle",viewtitle);
            Utility util=new Utility();
            
            URI startURI=new URI(context.getResource("/WEB-INF/viewList/").toString());
            String view=util.lookUpView(viewname,startURI,".html",false);
            if (view!=null && !view.equals("")){
               /* URI classURI=new URI(context.getResource("/WEB-INF/classes/").toString());
                //util.lookUpClass(viewModel, classURI).newInstance()
                System.out.println("viewModel="+viewModel);*/
                Class model;
                if(!viewModel.isEmpty()){
                    model=Class.forName(viewModel);
                    mv.addObject(viewname,model.newInstance());
                    System.out.println("viewname="+viewname);
                }
                
                mv.setViewName(view);
                String formAction=viewname.concat("?key=").concat(key).concat("&hole=").concat(hole);
                mv.addObject("formAction", formAction);
            }
            else{
                mv.setViewName("404");
            } 
        }
        catch(Exception ex){
            ex.printStackTrace();
            mv.setViewName(null);
        }
       return mv;
    }
    
    /**
     * This method returns the 404 error page
     * @return 
     */
    @RequestMapping(value="404")
    public String notfound(){
        return "404";
    }
    
    /**
     * This method returns the session-expired view
     * @return 
     */
    @RequestMapping(value="session-expired")
    public String sessionExpired(){
        return "session-expired";
    }

    
}
