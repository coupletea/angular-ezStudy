angular.module('myApp')
.factory('ClassService', ['$window', '$q', function($window, $q) {
    const classroomsKey = "classrooms";

    const getDataKey = (key) => {
        return $q((resolve, reject) => {
            try {
                resolve(JSON.parse($window.localStorage.getItem(key) || '[]'));
            } catch (error) {
                console.error(`Error reading ${key} from localStorage`, error);
                reject(`Error reading ${key} from localStorage`);
            }
        });
    };

    const setData = (key, data) => {
        return $q((resolve, reject) => {
            try {
                $window.localStorage.setItem(key, JSON.stringify(data));
                resolve();
            } catch (error) {
                console.error(`Error writing ${key} to localStorage`, error);
                reject(`Error writing ${key} to localStorage`);
            }
        });
    };

    const generateId = (data) => data.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    const getClassroomById = (id) => {
        return $q((resolve, reject) => {
            getDataKey(classroomsKey).then(classrooms => {
                const found = classrooms.find((item) => item.id == id);
                if (found) {
                    resolve(found);
                } else {
                    reject('Classroom not found');
                }
            }).catch(error => {
                reject(`Error accessing data: ${error}`);
            });
        });
    };

    const flatClassTree = (nodes, depth = 0, acc = []) => {
        nodes.forEach(node => {
            acc.push({ name: "---".repeat(depth) + node.name, group: node.group, id: node.id });
            if (node.children) {
                flatClassTree(node.children, depth + 1, acc);
            }
        });
        return acc;
    };

    const getClassroomsRoot = (classrooms) => {
        const classroomMap = new Map(classrooms.map(c => [c.id, c]));
        return classrooms.filter(c => !c.group).map(root => ({
            ...root,
            children: getClassroomChildren(root, classroomMap)
        }));
    };

    const getClassroomChildren = (classroom, classroomMap) => {
        return [...classroomMap.values()].filter(c => c.group === classroom.id)
            .map(child => ({
                ...child,
                children: getClassroomChildren(child, classroomMap)
            }));
    };

    return {
        getClassroomById : (id) => {
            return $q((resolve, reject) => {
                getDataKey(classroomsKey).then(classrooms => {
                    const found = classrooms.find((item) => item.id == id);
                    if (found) {
                        resolve(found);
                    } else {
                        reject('Classroom not found');
                    }
                }).catch(error => {
                    reject(`Error accessing data: ${error}`);
                });
            });
        },
        createClassroom: (payload) => {
            return getDataKey(classroomsKey).then(classrooms => {
                payload.id = generateId(classrooms);
                classrooms.push(payload);
                return setData(classroomsKey, classrooms);
            });
        },

        updateClassroom: (payload) => {
            return getDataKey(classroomsKey).then(classrooms => {
                const index = classrooms.findIndex(item => Number(item.id) === Number(payload.id));
                if (index !== -1) {
                    classrooms[index] = { ...classrooms[index], ...payload };
                    return setData(classroomsKey, classrooms);
                } else {
                    return $q.reject('Classroom not found');
                }
            });
        },

        deleteClassroom: (id) => {
            return getDataKey(classroomsKey).then(classrooms => {
                const filteredClassrooms = classrooms.filter(item => item.id !== id);
                return setData(classroomsKey, filteredClassrooms);
            });
        },

        getListClassrooms: (payload) => {
            return $q((resolve, reject) => {
                getDataKey(classroomsKey).then(classrooms => {
                    let classroomsRoot = getClassroomsRoot(classrooms);
                    var classroomTree = flatClassTree(classroomsRoot);
                    let start = (payload.page - 1) * payload.limit;
                    let end = start + payload.limit;
                    var newDataPagination = classroomTree.slice(start, end);
                    resolve({
                        data: newDataPagination,
                        total: classroomTree.length,
                    });
                }).catch(error => {
                    reject(`Error fetching classroom list: ${error}`);
                });
            });
        },
        
        getAllClassrooms: () => {
            return $q((resolve, reject) => {
                getDataKey(classroomsKey).then(classrooms => {
                    try {
                        const classroomsRoot = getClassroomsRoot(classrooms);
                        const flatClassroomList = flatClassTree(classroomsRoot);
                        resolve(flatClassroomList);  // Successfully resolve the promise with the processed data
                    } catch (error) {
                        reject(`Failed to process classroom data: ${error}`);  // Reject the promise if processing fails
                    }
                }).catch(error => {
                    reject(`Error retrieving classrooms: ${error}`);  // Handle errors related to data retrieval
                });
            });
        },
        
    };
}]);
