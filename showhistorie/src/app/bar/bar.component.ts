import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { MessageService } from '../services/message.service';
import { TimeLine } from '../util/timeLine';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit{

  /*
  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
*/
  @Input() timeLines?: TimeLine[];

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.messageService.add('app-bar init - before createSvg');
    this.createSvg();
    let data: any = this.timeLines;
    this.messageService.add('app-bar init - before drawBars with ' + this.timeLines?.length);
    this.drawBars(data);
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  //private drawBars(data: any[]): void {
    private drawBars(data: any[]): void {

      let maxlen = data.length;
      var ymin = Date.now();
      var ymax = 0;

      var timeLine: TimeLine[] = data;
      for(let i = 0; i < maxlen; i++) {
        this.messageService.add('app-bar drawBars - ymin: ' + ymin + ' ymax: ' + ymax);
        if (timeLine[i].startgeldigheid.getMilliseconds() < ymin) {
          ymin = timeLine[i].startgeldigheid.getMilliseconds();
        }
        if (typeof(timeLine[i].eindgeldigheid) !== undefined) {
          if (timeLine[i].eindgeldigheid!.getMilliseconds() > ymax) {
          ymax = timeLine[i].eindgeldigheid!.getMilliseconds();
          }
        }
        this.messageService.add('app-bar drawBars - ymin: ' + ymin + ' ymax: ' + ymax);
      }

      // Create the X-axis band scale
      const x = d3.scaleBand()
      .range([0, this.width])
  //    .domain(data.map(d => d.Framework))
      .domain(data.map(d => d.beginregistratie.getMilliseconds))
      .padding(0.2);

      // Draw the X-axis on the DOM
      this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

      // Create the Y-axis band scale
      const y = d3.scaleLinear()
//      .domain([0, 200000])
      .domain([ymin, ymax])
      .range([this.height, 0]);

      // Draw the Y-axis on the DOM
      this.svg.append("g")
      .call(d3.axisLeft(y));

      // Create and fill the bars
      this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.beginregistratie))
      .attr("y", (d: any) => y(d.startgeldigheid))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d.startgeldigheid.getMilliseconds()))
      .attr("fill", "#d04a35");
  }
}
