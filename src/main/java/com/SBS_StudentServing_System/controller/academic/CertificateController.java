package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.model.academic.Certificate;
import com.SBS_StudentServing_System.service.academic.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/academic/certificates")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CertificateController {

    // 证书文件存储目录
    private static final String CERTIFICATE_UPLOAD_DIR = "uploads/certificates/";

    @Autowired
    private CertificateService certificateService;

    public CertificateController() {
        // 确保证书目录存在
        File directory = new File(CERTIFICATE_UPLOAD_DIR);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                System.err.println("Failed to create certificate upload directory: " + CERTIFICATE_UPLOAD_DIR);
            }
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("studentId") String studentId,
            @RequestParam(value = "certificateType", defaultValue = "general") String certificateType,
            @RequestParam(value = "description", required = false) String description,
            Principal principal) {
        
        Map<String, Object> response = new HashMap<>();
        
        // 验证请求参数
        if (file.isEmpty()) {
            response.put("success", false);
            response.put("message", "File is empty");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (studentId == null || studentId.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student ID is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // 检查文件类型
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                response.put("success", false);
                response.put("message", "Only image and PDF files are allowed");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 生成唯一文件名
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
            }
            
            // 验证文件扩展名
            if (!fileExtension.matches("\\.(png|jpg|jpeg|gif|bmp|pdf)$")) {
                response.put("success", false);
                response.put("message", "Only PNG, JPG, JPEG, GIF, BMP, and PDF files are allowed");
                return ResponseEntity.badRequest().body(response);
            }
            
            String uniqueFileName = studentId + "_" + certificateType + "_" + 
                                  UUID.randomUUID().toString() + fileExtension;
            
            // 构建文件路径
            Path filePath = Paths.get(CERTIFICATE_UPLOAD_DIR + uniqueFileName);
            
            // 确保父目录存在
            Files.createDirectories(filePath.getParent());
            
            // 保存文件
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // 保存证书信息到数据库
            Certificate certificate = certificateService.saveCertificate(
                studentId, uniqueFileName, filePath.toString(), certificateType, description);
            
            // 返回成功响应
            response.put("success", true);
            response.put("message", "Certificate uploaded successfully");
            response.put("fileName", uniqueFileName);
            response.put("filePath", filePath.toString());
            response.put("certificateId", certificate.getId());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to upload certificate: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable String fileName,
            Principal principal) {
        try {
            Path filePath = Paths.get(CERTIFICATE_UPLOAD_DIR + fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                // 根据文件扩展名确定媒体类型
                String fileExtension = getFileExtension(fileName).toLowerCase();
                MediaType mediaType;
                
                switch (fileExtension) {
                    case ".pdf":
                        mediaType = MediaType.APPLICATION_PDF;
                        break;
                    case ".png":
                        mediaType = MediaType.IMAGE_PNG;
                        break;
                    case ".jpg":
                    case ".jpeg":
                        mediaType = MediaType.IMAGE_JPEG;
                        break;
                    case ".gif":
                        mediaType = MediaType.IMAGE_GIF;
                        break;
                    default:
                        mediaType = MediaType.APPLICATION_OCTET_STREAM;
                        break;
                }
                
                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                               "inline; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 新增API端点用于获取证书信息
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Certificate>> getCertificatesByStudentId(@PathVariable String studentId) {
        try {
            List<Certificate> certificates = certificateService.getCertificatesByStudentId(studentId);
            return ResponseEntity.ok(certificates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        try {
            List<Certificate> certificates = certificateService.getAllCertificates();
            return ResponseEntity.ok(certificates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCertificate(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            certificateService.deleteCertificate(id);
            response.put("success", true);
            response.put("message", "Certificate deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to delete certificate: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 辅助方法：获取文件扩展名
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}