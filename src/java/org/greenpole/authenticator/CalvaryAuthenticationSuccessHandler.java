package org.greenpole.authenticator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * <h1>CalvaryAuthenticationSuccessHandler </h1><br/>
 * <h5> implements org.springframework.security.web.authentication.AuthenticationSuccessHandler</h5>
 * <br/>
 * <br/>
 * 
 * @author Yusuf Samsudeen Babashola (Algorithm)
 * @version 1.0
 * 
 */
public class CalvaryAuthenticationSuccessHandler implements AuthenticationSuccessHandler{
    private RedirectStrategy redirectStrategy=new DefaultRedirectStrategy();
    
    
    /**
    * This Method calls the clearAuthenticationAttribute() 
    * on successful authentication process
    * 
    * @param request 
    * @param response
    * @param authentication
    */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,Authentication authentication){
        clearAuthenticationAttribute(request);
    }
    
    /**
     * This method returns the targetURL to be redirected to after successful
     * authentication process
     * @param authentication
     * @return String representing the targetURL relative to the context path
     */
    protected String determineTargetUrl(Authentication authentication){
        return "/index";
    }
    /**
     * This method clears the authentication attributes from memory
     * @param request 
     */
    protected void clearAuthenticationAttribute(HttpServletRequest request){
        HttpSession session=request.getSession();
        if(session==null){
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }
    /**
     * @return the redirectStrategy
     */
    public RedirectStrategy getRedirectStrategy() {
        return redirectStrategy;
    }

    /**
     * @param redirectStrategy the redirectStrategy to set
     */
    public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }
}
