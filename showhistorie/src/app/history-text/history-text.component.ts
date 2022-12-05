import {Component, OnInit} from '@angular/core';
import { MessageService } from '../services/message.service';
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

  /*
  private validLine(value: string): boolean {
    var isValid: boolean = false;
    var items = value.split(";");

    if (items.length == 4) {
      isValid = true;
    }
    return isValid;
  }
*/
  private validate(): void {
    var isValid: boolean = true;

    var lines = this.text.split("\n");
    var count = lines.length;
    this.messageService.add('app-history-text validate: number lines -  ' + count);

    if (count > 0) {
      lines.forEach(function (value) {
        isValid = (isValid && validLine(value));
      })
    }

    if (isValid) {
      this.valid.text = "valid";
    } else {
      this.valid.text = "invalid";
    }
    this.valid.class = "col " + this.valid.text;
  }

}

function validLine(value: string): boolean {
  var isValid: boolean = false;
  var items = value.split(";");

  if ((items.length == 4) && notEmpty(items)) {
    isValid = true;
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

