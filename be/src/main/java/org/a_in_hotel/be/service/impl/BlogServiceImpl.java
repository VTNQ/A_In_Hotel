package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BlogStatus;
import org.a_in_hotel.be.dto.request.BlogRequest;
import org.a_in_hotel.be.dto.request.BlogUpdateRequest;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.Blog;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.BlogMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.BlogRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.AccountService;
import org.a_in_hotel.be.service.BlogService;
import org.a_in_hotel.be.service.StaffService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final StaffService staffService;
    private final BlogMapper blogMapper;
    private final GeneralService generalService;
    private final SecurityUtils securityUtil;
    private final static List<String> SEARCH_FIELDS = List.of("blogCode", "title");
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    @Autowired
    public BlogServiceImpl(BlogRepository blogRepository,
                           BlogMapper blogMapper,
                           SecurityUtils securityUtil,
                           StaffService staffService,
                           GeneralService generalService,
                           ImageMapper imageMapper,
                           ImageRepository imageRepository) {
        this.blogRepository = blogRepository;
        this.blogMapper = blogMapper;
        this.securityUtil = securityUtil;
        this.staffService = staffService;
        this.generalService = generalService;
        this.imageMapper = imageMapper;
        this.imageRepository = imageRepository;
    }

    @Override
    public void save(BlogRequest request, MultipartFile file) {
        try {
            log.info("save blog request={}", request);
            Blog blog = blogMapper.toEntity(request, securityUtil.getCurrentUserId());
            blog=blogRepository.save(blog);
            if(file!=null && !file.isEmpty()) {
                try {
                    FileUploadMeta fileUploadMeta=generalService.saveFile(file,"blog");
                    Image blogImage= imageMapper.toBannerImage(fileUploadMeta);
                    blogImage.setEntityType("Blog");
                    blogImage.setEntityId(blog.getId());
                    imageRepository.save(blogImage);
                }catch (Exception e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu hình ảnh: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void update(Long id, BlogUpdateRequest request, MultipartFile file) {
        try {
            Blog blog = blogRepository.getReferenceById(id);
            Image oldImage =imageRepository.findFirstByEntityIdAndEntityType(blog.getId(), "Blog")
                    .orElse(null);
            blogMapper.updateEntity(request, blog, securityUtil.getCurrentUserId());
            if(file!=null && !file.isEmpty()) {
                if(oldImage!=null){
                    try {
                        generalService.deleFile(oldImage.getUrl());
                    }catch (Exception e) {
                        log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImage.getUrl(), e.getMessage());
                    }
                    imageRepository.delete(oldImage);
                }
                FileUploadMeta meta;
                try {
                    meta = generalService.saveFile(file, "blog");
                }catch (IOException e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi upload file: " + e.getMessage());
                }
                // Map sang entity Image mới
                Image newImage = imageMapper.toBannerImage(meta);
                newImage.setEntityType("Blog");
                newImage.setEntityId(blog.getId());
                imageRepository.save(newImage);
            }
            blogRepository.save(blog);
        } catch (EntityNotFoundException e) {
            log.warn("⚠️ Blog with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết có id: " + id);
        }
    }

    @Override
    public Page<BlogResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start get blog");
            Specification<Blog> sortable = RSQLJPASupport.toSort(sort);
            Specification<Blog> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Blog> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            Page<Blog> blogs = blogRepository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)),
                    pageable
            );
            blogs.forEach(blog ->
                    imageRepository.findFirstByEntityIdAndEntityType(blog.getId(), "Blog")
                            .ifPresent(blog::setThumbnail)
            );

            return  blogs.map(blog -> blogMapper.toResponse(blog,staffService));
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        try {
            log.info("start update blog status={}", status);
            Blog blog = blogRepository.getReferenceById(id);
            blog.setStatus(BlogStatus.fromCode(status).getCode());
            blog.setUpdatedBy(securityUtil.getCurrentUserId().toString());
            blogRepository.save(blog);
        } catch (EntityNotFoundException e) {
            log.warn("blog with id {} not found: {}", id, e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public BlogResponse getById(Long id) {
        Blog blog =blogRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("blog not found"));
        imageRepository.findFirstByEntityIdAndEntityType(blog.getId(), "Blog")
                .ifPresent(blog::setThumbnail);
        return blogMapper.toResponse(blog,staffService);
    }
}
