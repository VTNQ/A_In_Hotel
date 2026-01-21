function appendFormData(fd: FormData, value: any, key: string) {
  if (value === undefined || value === null) return;

  // File / Blob
  if (value instanceof File || value instanceof Blob) {
    fd.append(key, value);
    return;
  }

  // Array → hotlines[0].phone
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      appendFormData(fd, v, `${key}[${i}]`);
    });
    return;
  }

  // Object → hotlines[0].phone (DÙNG DẤU CHẤM)
  if (typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      appendFormData(fd, v, `${key}.${k}`);
    });
    return;
  }

  // primitive
  fd.append(key, String(value));
}

export function toFormData(data: any) {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => appendFormData(fd, v, k));
  return fd;
}
