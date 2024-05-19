exports.getDate = getDate;

function getDate() {

    let date = new Date();

    let options = {

        weekday: "long",
        day: "numeric",
        month: "long"

    };

    let today = date.toLocaleDateString("en-US", options);

    return today
}

exports.getDay = getDay;

function getDay() {

    let date = new Date();

    let options = {

        weekday: "long"

    };

    let today = date.toLocaleDateString("en-US", options);

    return today;
}