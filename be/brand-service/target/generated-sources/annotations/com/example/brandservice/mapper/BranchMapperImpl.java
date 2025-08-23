package com.example.brandservice.mapper;

import com.example.brandservice.Enum.BranchStatus;
import com.example.brandservice.dto.request.BranchRequest;
import com.example.brandservice.entity.Branch;
import java.time.Instant;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-23T20:09:16+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class BranchMapperImpl implements BranchMapper {

    @Override
    public Branch toEntity(BranchRequest branch) {
        if ( branch == null ) {
            return null;
        }

        Branch branch1 = new Branch();

        branch1.setName( branch.getName() );
        branch1.setAddress( branch.getAddress() );
        branch1.setIdUser( branch.getIdUser() );

        branch1.setStatus( BranchStatus.ACTIVE );
        branch1.setCode( com.example.brandservice.mapper.BranchMapper.generateBranchCode() );

        return branch1;
    }
}
