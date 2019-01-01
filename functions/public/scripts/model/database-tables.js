class User {
    constructor(id, country, course, courseId, displayName, profilePicUrl, profileSet, university, year) {
        this.id = id;
        this.country = country;
        this.course = course;
        this.courseId = courseId;
        this.displayName = displayName;
        this.profilePicUrl = profilePicUrl;
        this.profileSet = profileSet;
        this.university = university;
        this.year = year;
    }
}

class Country {
    constructor(id, countryName) {
        this.id = id;
        this.countryName = countryName;
    }

    getCountryName() {
        return this._countryName;
    }

    setCountryName(countryName) {
        this._countryName = countryName;
    }

}

class University {
    constructor(id, universityName, countryId) {
        this.id = id;
        this.universityName = universityName;
        this.countryId = countryId;
    }
}

class Course {
    constructor(id, courseName, universityId, years) {
        this.id = id;
        this.courseName = courseName;
        this.universityId = universityId;
        this.years = years;
    }
}

class CourseUnit {
    constructor(id, courseUnitName, courseId) {
        this.id = id;
        this.courseUnitName = courseUnitName;
        this.courseId = courseId;
    }
}

class PastPaper {
    constructor(id, pastPaperName, courseUnitId) {
        this.id = id;
        this.pastPaperName = pastPaperName;
        this.courseUnitId = courseUnitId;
    }
}

class Question {
    constructor(id, questionName, pastPaperId) {
        this.id = id;
        this.questionName = questionName;
        this.pastPaperId = pastPaperId;
    }
}

function checkIfCountryNameIsInCountryList(countryName) {
    const validCountryList = ["UG", "KE"]
    var returnValue = false
    if (validCountryList.includes(countryName)){
        returnValue = true
    } else {
        throw new Exception("Country not allowed");
    }

    return returnValue
}

function checkIfCountryNameIsAString(countryName) {
    var returnValue = false
    const type = typeof countryName
    if (type === ("string")){
        returnValue = true
    } else {
        throw new Exception("Invalid country format!");
    }
    return returnValue
}

function checkIfCountryNameIsValid(countryName) {
 return checkIfCountryNameIsInCountryList(countryName) && checkIfCountryNameIsAString(countryName)
}

