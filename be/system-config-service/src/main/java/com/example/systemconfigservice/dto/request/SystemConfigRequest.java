package com.example.systemconfigservice.dto.request;

import com.example.systemconfigservice.Enum.SystemConfigType;
import lombok.Data;

@Data
public class SystemConfigRequest {
    private String key;
    private String value;
    private SystemConfigType systemConfigType;
}
