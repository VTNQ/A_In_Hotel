package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BlogStatus;
import org.a_in_hotel.be.dto.request.BlogDTO;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.Blog;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.entity.Tag;
import org.a_in_hotel.be.exception.BlogNotFoundException;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.BlogMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.BlogRepository;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.repository.TagRepository;
import org.a_in_hotel.be.service.BlogService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final CategoryRepository categoryRepository;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    private final TagRepository tagRepository;
    private final GeneralService generalService;
    private final BlogMapper blogMapper;
    private static final List<String> SEARCH_FIELDS = List.of("title");
    @Override
    public void create(BlogDTO dto, MultipartFile file) {
        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId is required");
        }

        Blog blog = new Blog();
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setCreatedAt(LocalDateTime.now());
        blog.setUpdatedAt(LocalDateTime.now());

        // Category
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        blog.setCategory(category);

        // Tags (null-safe)
        Set<Tag> tags = (dto.getTags() == null ? Collections.<String>emptySet() : Set.copyOf(dto.getTags()))
                .stream()
                .filter(name -> name != null && !name.isBlank())
                .map(name -> tagRepository.findByName(name.trim())
                        .orElseGet(() -> tagRepository.save(new Tag(null, name.trim()))))
                .collect(Collectors.toSet());
        blog.setTags(tags);
        if(file !=null && !file.isEmpty()) {
            try {
                FileUploadMeta fileUploadMeta=generalService.saveFile(file,"blog/");
                Image image=imageMapper.toBannerImage(fileUploadMeta);
                imageRepository.save(image);
                blog.setImage(image);
            }catch (Exception e) {
                throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Lỗi khi lưu hình ảnh: " + e.getMessage());
            }
        }

        // Lịch đăng
        if (dto.getPublishAt() != null && dto.getPublishAt().isAfter(LocalDateTime.now())) {
            blog.setStatus(BlogStatus.SCHEDULED);
            blog.setPublishAt(dto.getPublishAt());
        } else {
            blog.setStatus(BlogStatus.DRAFT);
            blog.setPublishAt(null);
        }
        blogRepository.save(blog);
    }

    @Override
    public void update(Long id, BlogDTO dto,MultipartFile file) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException(id));

        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setUpdatedAt(LocalDateTime.now());

        // Category (chỉ cập nhật khi FE gửi)
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
            blog.setCategory(category);
        }

        // Tags (chỉ cập nhật khi FE gửi)
        if (dto.getTags() != null) {
            Set<Tag> tags = dto.getTags().stream()
                    .filter(name -> name != null && !name.isBlank())
                    .map(name -> tagRepository.findByName(name.trim())
                            .orElseGet(() -> tagRepository.save(new Tag(null, name.trim()))))
                    .collect(Collectors.toSet());
            blog.setTags(tags);
        }
        if(file !=null && !file.isEmpty()) {
            try {
                FileUploadMeta fileUploadMeta=generalService.saveFile(file,"blog");
                Image image=imageMapper.toBannerImage(fileUploadMeta);
                imageRepository.save(image);
                blog.setImage(image);
            }catch (Exception e) {
                throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi khi lưu hình ảnh: " + e.getMessage());
            }
        }

        // Lịch đăng (chỉ cập nhật khi FE gửi)
        if (dto.getPublishAt() != null) {
            if (dto.getPublishAt().isAfter(LocalDateTime.now())) {
                blog.setStatus(BlogStatus.SCHEDULED);
                blog.setPublishAt(dto.getPublishAt());
            } else {
                blog.setStatus(BlogStatus.DRAFT);
                blog.setPublishAt(null);
            }
        }
        blogRepository.save(blog);
    }

    @Override
    public void delete(Long id) {
        try {
            log.info("start to delete blog : {}", id);
            Blog blog = blogRepository.findById(id)
                    .orElseThrow(() -> new BlogNotFoundException(id));
            Image image = blog.getImage();
            if (image != null) {
                try {
                    generalService.deleFile(image.getUrl());
                    imageRepository.delete(image);
                } catch (Exception e) {
                    log.warn("Không thể xóa ảnh trên MinIO hoặc DB cho blog {}: {}", id, e.getMessage());
                }
            }
            blogRepository.delete(blog);
            log.info("end to delete blog : {}", id);
        } catch (Exception e) {
            log.error("delete blog error : {}", e.getMessage());
        }
    }

    @Override
    public Page<Blog> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
            try {
                log.info("start to get List Blog ");
                Specification<Blog>sortable= RSQLJPASupport.toSort(sort);
                Specification<Blog>filterable= RSQLJPASupport.toSpecification(filter);
                Specification<Blog>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
                Pageable pageable=all ? PageRequest.of(page,size):PageRequest.of(page-1,size);
                return blogRepository.
                        findAll(sortable.and(filterable).and(searchable),pageable);
            }catch (Exception e) {
                e.printStackTrace();
                log.error(e.getMessage());
                return null;
            }
    }

    @Override
    public Blog findById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException(id));
    }


}
