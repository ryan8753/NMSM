package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

@Slf4j
@Service
public class FileServiceImpl implements FileService{
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Override
    public void uploadFile(MultipartFile file, String id) {
        try {
            // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
//            String savePath = System.getProperty("user.dir") + "\\files";
            String savePath = "/var/lib/jenkins/jeju/"+ LocalDate.now()+"/";


            // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
            if (!new File(savePath).exists()) {
                new File(savePath).mkdir();
            }

            User user = userService.searchByKakaoId(id);

            //이미 등록된 사진이 있으면 삭제
//            if(userRepository.findOneByKakaoId(id)!=null){
//               user.setImagePath("");
//               userRepository.save(user);
//            }

            //저장될 경로
//          String filePath = savePath + "\\" + id + "." + extractExt(file.getOriginalFilename());
            String filePath = "/var/lib/jenkins/jeju/" +  id + "." + extractExt(file.getOriginalFilename());

            File newfile = new File("/var/lib/jenkins/jeju/" + id);
//            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
            newfile.createNewFile();
            file.transferTo(new File("/var/lib/jenkins/jeju/"));


            user.setImagePath(filePath);

            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public User findImageById(String id) {

        return userRepository.findOneByKakaoId(id);
    }

    @Override
    public int deleteById(String id) {

        User targetImage = this.findImageById(id);
        if(targetImage!=null){
            File file = new File(targetImage.getImagePath());
            file.delete();
            targetImage.setImagePath("");
            userRepository.save(targetImage);
            return 1;
        }else {
            return 0;
        }
    }

    private String uploadDir = System.getProperty("user.dir") + "\\files";

    public void fileUpload(MultipartFile multipartFile) {
        // File.seperator 는 OS종속적이다.
        // Spring에서 제공하는 cleanPath()를 통해서 ../ 내부 점들에 대해서 사용을 억제한다
        Path copyOfLocation = Paths.get(uploadDir + File.separator + StringUtils.cleanPath(multipartFile.getOriginalFilename()));
        try {
            // inputStream을 가져와서
            // copyOfLocation (저장위치)로 파일을 쓴다.
            // copy의 옵션은 기존에 존재하면 REPLACE(대체한다), 오버라이딩 한다
            Files.copy(multipartFile.getInputStream(), copyOfLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();

        }

    }

    // 확장자 추출
    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        return originalFilename.substring(pos + 1);
    }
}