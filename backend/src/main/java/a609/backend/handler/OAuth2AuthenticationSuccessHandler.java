package a609.backend.handler;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String id = String.valueOf((Long)oAuth2User.getAttribute("id"));
        String nickname, imagePath;
        if(userRepository.countByKakaoId(id)>0){
            User user = userRepository.findOneByKakaoId(id);
            nickname = user.getNickname();
            imagePath = user.getImagePath();
        }else {
            Map<String, Object> properties = (Map<String, Object>) oAuth2User.getAttributes().get("properties");
            nickname = (String) properties.get("nickname");
            imagePath = (String) properties.get(("profile_image_url"));
        }
        String jwt = jwtUtil.generateJwtToken(id, nickname, imagePath);

        String url = makeRedirectUrl(jwt);
        System.out.println("url: " + url);
        if (response.isCommitted()) {
            logger.debug("응답이 이미 커밋된 상태입니다. " + url + "로 리다이렉트하도록 바꿀 수 없습니다.");
            return;
        }
        getRedirectStrategy().sendRedirect(request, response, url);
    }

    private String makeRedirectUrl(String token) {
        return UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect?token="+token)
                .build().toUriString();
    }
}