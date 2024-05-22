angular.module("myApp").factory("StudentData", [
  "$window",
  function ($window) {
    const studentsKey = "students";
    const classroomsKey = "classrooms";

    // Lấy dữ liệu từ localStorage
    function getDataFromLocalStorage(key) {
      try {
        const data = $window.localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error(
          `Lỗi khi lấy dữ liệu từ localStorage cho key ${key}:`,
          error
        );
        return [];
      }
    }

    // Đặt dữ liệu vào localStorage
    function setDataInLocalStorage(key, data) {
      try {
        const stringData = JSON.stringify(data);
        $window.localStorage.setItem(key, stringData);
      } catch (error) {
        console.error(
          `Lỗi khi đặt dữ liệu vào localStorage cho key ${key}:`,
          error
        );
      }
    }

    // Tạo ID duy nhất cho các mục mới
    function generateId(data) {
      return data.length ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    }

    const classroomsCache = getDataFromLocalStorage(classroomsKey); // Cache này sẽ giúp giảm thiểu số lần truy cập vào localStorage

    const getClassroomById = (id) => {
      return new Promise((resolve, reject) => {
        const classroom = classroomsCache.find((item) => item.id == id);
        if (classroom) {
          resolve(classroom);
        } else {
          reject(`No classroom found with ID: ${id}`);
        }
      });
    };

    const flatClassTree = (nodes, depth = 0, acc = []) => {
      nodes.forEach((node) => {
        acc.push({
          name: "---".repeat(depth) + node.name,
          group: node.group,
          id: node.id,
        });
        if (node.children) {
          flatClassTree(node.children, depth + 1, acc);
        }
      });
      return acc;
    };

    const getClassroomsRoot = (classrooms) => {
      const classroomMap = new Map(classrooms.map((c) => [c.id, c]));
      return classrooms
        .filter((c) => !c.group)
        .map((root) => ({
          ...root,
          children: getClassroomChildren(root, classroomMap),
        }));
    };

    const getClassroomChildren = (classroom, classroomMap) => {
      return [...classroomMap.values()]
        .filter((c) => c.group === classroom.id)
        .map((child) => ({
          ...child,
          children: getClassroomChildren(child, classroomMap),
        }));
    };

    return {
      getClassroomById: getClassroomById,
      getStudentById: (id) => {
        return new Promise((resolve, reject) => {
          try {
            const students = getDataFromLocalStorage(studentsKey);
            const student = students.find((item) => item.id == id);
            if (student) {
              resolve(student); // Trả về student nếu tìm thấy
            } else {
              reject("Không tìm thấy sinh viên với ID: " + id); // Trả về lỗi nếu không tìm thấy
            }
          } catch (error) {
            console.error("Lỗi khi truy cập localStorage: ", error);
            reject(error); // Trả về lỗi nếu có vấn đề khi truy xuất localStorage
          }
        });
      },

      createStudent: (payload) => {
        let students = getDataFromLocalStorage(studentsKey);
        payload.id = generateId(students);
        students.push(payload);
        setDataInLocalStorage(studentsKey, students);
        return Promise.resolve(payload);
      },

      updateStudent: (payload) => {
        let students = getDataFromLocalStorage(studentsKey);
        const index = students.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          students[index] = { ...students[index], ...payload };
          setDataInLocalStorage(studentsKey, students);
          return Promise.resolve(students[index]);
        } else {
          return Promise.reject(new Error("Không tìm thấy sinh viên"));
        }
      },

      deleteStudent: (id) => {
        let students = getDataFromLocalStorage(studentsKey);
        const filteredStudents = students.filter((item) => item.id !== id);
        setDataInLocalStorage(studentsKey, filteredStudents);
        return Promise.resolve(); // Xác nhận việc xóa đã hoàn thành
      },

      getListStudents: ({ name, age, classroom, page, limit }) => {
        return new Promise((resolve, reject) => {
          try {
            const students = getDataFromLocalStorage(studentsKey);
            let filtered = students.filter(
              (student) =>
                (!name || student.name.includes(name)) &&
                (!age || student.age === age) &&
                (!classroom || student.classroom === classroom)
            );

            const total = filtered.length;
            const start = (page - 1) * limit;
            const paginatedItems = filtered.slice(start, start + limit);

            Promise.all(
              paginatedItems.map((student) => {
                return getClassroomById(student.classroom)
                  .then((classroom) => {
                    student.classroomName = classroom
                      ? classroom.name
                      : "Lớp không xác định";
                  })
                  .catch(() => {
                    student.classroomName = "Lớp không xác định";
                  });
              })
            ).then(() => {
              resolve({ data: paginatedItems, total: total });
            });
          } catch (error) {
            console.error("Error processing students:", error);
            reject(error);
          }
        });
      },

      getTotalStudents: () => getDataFromLocalStorage(studentsKey).length,

      getAllClassrooms: () => {
        let classrooms = getDataFromLocalStorage(classroomsKey);
        return Promise.resolve(flatClassTree(getClassroomsRoot(classrooms)));
      },
    };
  },
]);
