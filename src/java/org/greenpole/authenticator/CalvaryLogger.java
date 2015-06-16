package org.greenpole.authenticator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.greenpole.model.profiler.RelatedTask;
import org.greenpole.model.profiler.UserDetails;
import org.greenpole.model.profiler.UserProfile;
import org.greenpole.model.profiler.ViewGroup;
import org.greenpole.model.profiler.ViewList;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

/**
 * <h1>CalvaryLogger </h1>
 * <h5> implements org.springframework.security.authentication.AuthenticationProvider</h5>
 * This class is responsible for authentication process
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
@Component
public class CalvaryLogger implements AuthenticationProvider  {
    
    private  List<UserProfile> userProfileList;
     private Map<String,String> userList=new HashMap<String,String>(3){
        {
            put("samsudeen.yusuf@africaprudentialregistrars.com","Samsudeen");
            put("ahmad.gbadamosi@africaprudentialregistrars.com","Gbadamosi");
            put("akinwale.agbaje@africaprudentialregistrars.com","Agbaje");
        }
    };
    
     /**
      * This method is responsible for authenticating user and granting the assigned
      * privileges 
      * @param authentication
      * @return Authentication
      * @throws AuthenticationException 
      */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException{
        String principal=authentication.getName();
        String password=authentication.getCredentials().toString();
        
        if(userList.containsKey(principal) && userList.get(principal).equals(password)){
            List<GrantedAuthority> grantedAuths = new ArrayList();
            if(principal.equals("samsudeen.yusuf@africaprudentialregistrars.com")){
                grantedAuths.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            }
            else if (principal.equals("akinwale.agbaje@africaprudentialregistrars.com")){
                grantedAuths.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            }
            else{
                grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
            
            return new UsernamePasswordAuthenticationToken(principal,password,grantedAuths);
        }
        throw new BadCredentialsException("Username/Password does not match for "+ principal);
    }
 
    
    /**
     * 
     * @param authentication
     * @return 
     */
    @Override
    public boolean supports(Class<?> authentication){
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
    private  UserProfile getUserList(){
        Random rand=new Random();
        UserDetails user1=new UserDetails("Samsudeen","Babashola","Yusuf","IT-Software","samsudeen.yusuf@africaprudentialregistrars.com");
        
        Map<String,RelatedTask> relatedTask=new HashMap();
//        relatedTask.put(getKey(32),new RelatedTask("Edit Shareholder","editshareholder"));
  //      relatedTask.put(getKey(32),new RelatedTask("Transpose Holder Name","transposeholdername"));
        
        Map<String,ViewList> viewList=new HashMap();
        viewList.put(getKey(32), new ViewList("Holder Details","holderDetails",relatedTask,"regular_view",""));
        
        Map<String,ViewGroup> viewGroup=new HashMap();
        viewGroup.put(getKey(32),new ViewGroup("Holder Management",viewList));
        
        UserProfile userprofile=new UserProfile(user1,"regular_user","LEVEL 09",viewGroup,50000,5000);
        userProfileList=new ArrayList();
        userProfileList.add(userprofile);
        
        return userprofile;
    }
    
    
    
    private static String getKey(int length){
        String characters="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNONPQRSTUVWXYZ";
        String key="";
        Random rand=new Random();
        for(int i=0;i<length;i++){
            key+=characters.charAt(rand.nextInt(62)+1);
        }
        return key;
    }
}
