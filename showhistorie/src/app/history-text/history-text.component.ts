import {Component, OnInit} from '@angular/core';
import { MessageService } from '../services/message.service';
import { TimeLine } from '../util/timeLine';
import {Valid} from '../util/valid';

@Component({
  selector: 'app-history-text',
  templateUrl: './history-text.component.html',
  styleUrls: ['./history-text.component.css']
})
export class HistoryTextComponent implements OnInit {

  headertext = "startgeldigheid; eindgeldigheid; beginregistratie; eindregistratie";
  text = "";
  valid: Valid = {
    class: "col",
    text: "invalid"
  }

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.validate();
  }

  drawit(): void {
    this.messageService.add('app-history-text drawit: ' + this.text);
  }

  onKey(event: string) {
    this.messageService.add('app-history-text onKey: ' + this.text);
    this.validate();
  }

  private validate(): void {
    var isValid: boolean = true;

    var lines = this.text.split("\n");
    var count = lines.length;
    this.messageService.add('app-history-text validate: number lines -  ' + count);

    if (count > 0) {
      const maxLen: number = lines.length;
      for (let i  = 0; i < maxLen; i++) {
        this.messageService.add('app-history-text validate: check line - ' + lines[i]);
        var timeLine: TimeLine = textToTimeLine(lines[i]);
        isValid = (isValid && validLine(lines[i]));
        this.messageService.add('app-history-text validate: check line - ' + lines[i] + ' result: ' + isValid);
        if (isValid == false) {
          break;
        }
      }
      /*
      lines.forEach(function (value) {
        var timeLine: TimeLine = textToTimeLine(value)
        isValid = (isValid && validLine(value));
      })
      */
    }

    if (isValid) {
      this.valid.text = "valid";
    } else {
      this.valid.text = "invalid";
    }
    this.valid.class = "col " + this.valid.text;
  }

}

function stringToDate(value: string): Date {
  var date: Date;
  var items = value.split('-');
  var year: number = parseInt(items[0]);
  var month: number = parseInt(items[1]);
  var day: number = parseInt(items[2]);

  date = new Date(year, month, day);

  return date;
}

function stringToDateTime(value: string): Date {
  var date: Date;
  var dateElement = value.split('T');
  var dateString = dateElement[0];
  var items = dateString.split('-');
  var year: number = parseInt(items[0]);
  var month: number = parseInt(items[1]);
  var day: number = parseInt(items[2]);
  var timeString = dateElement[1];  // hh:mm:ss(.hhhhhh)?Z
  var timeValues = timeString.split(':')
  var hours:number = parseInt(timeValues[0]);
  var minutes:number = parseInt(timeValues[1]);
  var timeEnd = timeValues[2].split('.');
  var seconds:number = parseInt(timeEnd[0]);
  let maxlen = timeEnd[1].length;
  var milliseconds:number = parseInt(timeEnd[1].substring(0,maxlen - 1));

  date = new Date(year, month, day, hours, minutes, seconds, milliseconds);

  return date;
}


function validDate(value: string): boolean {
  var valid: boolean = false;

  // check if specified value matches YYYY-MM-DD
  valid = (value.length == 10);
  if (valid == true) {
    const regExp: RegExp = RegExp('^\\d{4}-\\d{2}-\\d{2}$');
    valid = regExp.test(value);
    console.log("valid: " + valid);
  }
  return valid;
}

function validDateTime(value: string): boolean {
  var valid: boolean = false;

  // check if specified value matches YYYY-MM-DD
  valid = (value.length >= 10);
  if (valid == true) {
    const regExp: RegExp = RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(.\\d{1,6})?Z$');
    valid = regExp.test(value);
  }
  return valid;
}


function textToTimeLine(value: string): TimeLine {
  var timeLine: TimeLine = {startgeldigheid: new Date(0),  beginregistratie: new Date(0)};

  var items = value.split(";");
  var curitem = items[0].trim();

  if (value.length > 0) {
    if (curitem.length > 0) {
      if (validDate(curitem)) {
        timeLine.startgeldigheid = stringToDate(curitem);
      }
    }

    if (items.length > 1) {
      curitem = items[1].trim();
      if (curitem.length > 0) {
        if (validDate(curitem)) {
          timeLine.eindgeldigheid = stringToDate(curitem);
        }
      }
    }

    if (items.length > 2) {
      curitem = items[2].trim();
      if (curitem.length > 0) {
        if (validDateTime(curitem)) {
          timeLine.beginregistratie = stringToDate(curitem);
        }
      }
    }

    if (items.length > 3) {
      curitem = items[3].trim();
      if (curitem.length > 0) {
        if (validDateTime(curitem)) {
          timeLine.eindregistratie = stringToDate(curitem);
        }
      }
    }
  }
  return timeLine;
}

function validLine(value: string): boolean {
  var isValid: boolean = false;
  var items = value.split(";");

  if ((items.length == 4)) {
    isValid = true;
  }

  // startgeldigheid is mandatory
  if (isValid == true) {
    isValid = (isValid && items[0].length > 0);
    if (isValid == true) {
      isValid = (isValid && validDate(items[0].trim()));
    }

    // eindgeldigheid optional
    if (items[1].length > 0) {
      if (isValid == true) {
        isValid = (isValid && validDate(items[1].trim()));
      }
    }

    // beginregistratie is mandatory
    if (items[2].length > 0) {
      if (isValid == true) {
        isValid = (isValid && validDateTime(items[2].trim()));
      }
    }

    // eindregistratie is optional
    if (items[3].length > 0) {
      if (isValid == true) {
        isValid = (isValid && validDateTime(items[3].trim()));
      }
    }

  }
  return isValid;
}

function notEmpty(items: string[]) {
  var isValid: boolean = true;

  let len = items.length;

  for (let index = 0; index < len; index++) {
    isValid = isValid && (items[index].length > 0);
  }

  return isValid;
}

