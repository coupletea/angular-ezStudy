angular.module('myApp').factory('ValidationService', function() {
    const validCheck = (data, existingNames = []) => {
        const errors = Object.entries(data).reduce((acc, [key, field]) => {
            if (field.rules && field.rules.length > 0) {
                for (const rule of field.rules) {
                    const result = typeof rule === "function"
                        ? rule(field.value, existingNames)
                        : rule[0](field.value, rule[1]);

                    if (!result.valid) {
                        data[key].error = result.error;
                        acc.push({ key, error: result.error });
                        break; // Stop checking if an error is found
                    } else {
                        delete data[key].error; // Clear error if none found
                    }
                }
            }
            return acc;
        }, []);

        return errors;
    };

    const validRequired = (value) => ({
        valid: value != null && value.length > 0,
        error: "Chưa có thông tin.",
    });

    const validMaxlength = (value, length) => ({
        valid: value != null && value.length <= length,
        error: `Đọ dài tối đa : ${length} ký tự.`,
    });

    const validMinlength = (value, length) => ({
        valid: value != null && value.length >= length,
        error: `Độ dài tối thiểu : ${length} ký tự.`,
    });
     const validUnique = (value, existingNames) => ({
        valid: !existingNames.includes(value.trim()), // Cải thiện việc kiểm tra bằng cách loại bỏ khoảng trắng
        error: "Lớp đã tồn tại.",
      });

    return { validCheck, validRequired, validMaxlength, validMinlength, validUnique};
});
