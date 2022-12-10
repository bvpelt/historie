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
    text: "invalid",
    btclass: "btn btn-light",
    isDisabled: true
  }
  showDrawing:boolean = true;
  sortedTimeLines: TimeLine[] = [];

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.validate();
  }

  drawit(): void {
    this.messageService.add('app-history-text drawit: ' + this.text);
    this.showDrawing = true;

    var lines = this.text.split("\n");
    var count = lines.length;
    var timeLines: TimeLine[] = [];

    if (count > 0) {
      const maxLen: number = lines.length;
      for (let i  = 0; i < maxLen; i++) {
        this.messageService.add('app-history-text draw: textToTimeLine - ' + lines[i]);
        var timeLine: TimeLine = textToTimeLine(lines[i]);
        timeLines.push(timeLine);
        this.messageService.add('app-history-text draw: textToTimeLine - ' + lines[i] + ' result: ' + timeLine);
      }
    }

    this.sortedTimeLines = timeLines.sort((obj1, obj2) => {
      if (obj1.beginregistratie.getMilliseconds() > obj2.beginregistratie.getMilliseconds()) {
        return 1;
      }
      if (obj1.beginregistratie.getMilliseconds() < obj2.beginregistratie.getMilliseconds()) {
        return -1;
      }
      return 0;
    });

  }

  onKey(event: string) {
    this.messageService.add('app-history-text onKey: ' + this.text);
    this.validate();
  }

  //
  // check content of textarea
  //
  private validate(): void {
    var isValid: boolean = true;

    var lines = this.text.split("\n");
    var count = lines.length;
    this.messageService.add('app-history-text validate: number lines -  ' + count);

    if (count > 0) {
      const maxLen: number = lines.length;
      for (let i  = 0; i < maxLen; i++) {
        this.messageService.add('app-history-text validate: check line - ' + lines[i]);
        isValid = (isValid && validLine(lines[i]));
        this.messageService.add('app-history-text validate: check line - ' + lines[i] + ' result: ' + isValid);
        if (isValid == false) {
          break;
        }
      }
    }

    if (isValid) {
      this.valid.text = "valid";
      this.valid.btclass = "btn btn-primary";
      this.valid.isDisabled = false;
    } else {
      this.valid.text = "invalid";
      this.valid.btclass = "btn btn-light";
      this.valid.isDisabled = true;
      this.showDrawing = false;
    }
    this.valid.class = "col " + this.valid.text;
  }

}

function stringToDate(value: string): Date {
  var date: Date;
  var items = value.split('-');
  var year: number = parseInt(items[0]);
  var month: number = parseInt(items[1]) - 1;
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
  var month: number = parseInt(items[1]) - 1;
  var day: number = parseInt(items[2]);
  var timeString = dateElement[1];  // hh:mm:ss(.hhhhhh)?Z
  var timeValues = timeString.split(':')
  var hours:number = parseInt(timeValues[0]);
  var minutes:number = parseInt(timeValues[1]);
  //
  // hh:mm:ss(.hhhhhh)?Z
  // if no '.' in string timeEnd is ssZ
  var timeEnd = timeValues[2].split('.');
  var seconds:number = 0;
  var maxlen: number = 0;
  if (timeEnd[0].length == 2) { // (.hhhhhh) available
    seconds = parseInt(timeEnd[0]);
    maxlen = timeEnd[1].length;
  } else {
    seconds = parseInt(timeEnd[0].substring(0, 2));
  }
  var milliseconds:number = 0;
  if (maxlen > 0) {
    milliseconds = parseInt(timeEnd[1].substring(0,maxlen - 1));
  }

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
      timeLine.startgeldigheid = stringToDate(curitem);
    }

    if (items.length > 1) {
      curitem = items[1].trim();
      if (curitem.length > 0) {
        timeLine.eindgeldigheid = stringToDate(curitem);
      }
    }

    if (items.length > 2) {
      curitem = items[2].trim();
      if (curitem.length > 0) {
        timeLine.beginregistratie = stringToDateTime(curitem);
      }
    }

    if (items.length > 3) {
      curitem = items[3].trim();
      if (curitem.length > 0) {
        timeLine.eindregistratie = stringToDateTime(curitem);
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
    isValid = (isValid && items[0].trim().length > 0);
    if (isValid == true) {
      isValid = (isValid && validDate(items[0].trim()));
    }

    // eindgeldigheid optional
    if (items[1].trim().length > 0) {
      if (isValid == true) {
        isValid = (isValid && validDate(items[1].trim()));
      }
    }

    // beginregistratie is mandatory
    if (items[2].trim().length > 0) {
      if (isValid == true) {
        isValid = (isValid && validDateTime(items[2].trim()));
      }
    }

    // eindregistratie is optional
    if (items[3].trim().length > 0) {
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

