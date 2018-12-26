class Country {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    getCountryName() {
        return this._countryName;
    }

    setCountryName(countryName) {
        this._countryName = countryName;
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

class User {
    constructor(id) {
        this.id = id;
    }
}

class University {
    constructor(id, name, countryId) {
        this.id = id;
        this.name = name;
        this.countryId = countryId;
    }
}

class Course {
    constructor(id, name, universityId, years) {
        this.id = id;
        this.name = name;
        this.universityId = universityId;
        this.years = years;
    }
}
