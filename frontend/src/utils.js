import React, {Component} from 'react';


export const retrieveDates = (year, month) => {
    if(month == 0){
        return [[new Date(year-1, 0), new Date(new Date(year, 0)-1)], [new Date(year, 0), new Date(new Date(parseInt(year) + 1, 0)-1)]]
    }
    else{
        return [[new Date(year, month-2), new Date(new Date(year,month-1)-1)], [new Date(year, month-1), new Date(new Date(year, month)-1)]]
    }
};

