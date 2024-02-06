import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { faUsers, faFilePen, faFilePdf, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-meeting-add-topic',
  templateUrl: './meeting-add-topic.component.html',
  styleUrls: ['./meeting-add-topic.component.css']
})
export class MeetingAddTopicComponent {
  @Input() inputValue!: string;
  form!: FormGroup;
  topics: any = {}
  FAClist: any;
  topic_list: any;
  topic_done: any;

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      
      //console.log('item add: ', event.previousIndex);
      //console.log('item topics: ', this.topics);
      //console.log('remove item: ', event.previousContainer.data);
      //console.log(this.topic_list);
    }
  }


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: ApiService
  ) {

  }

  ngOnInit() {
    this.fetchTopic();
    this.fetchTopicDone(8);
  }

  fetchTopic() {
    this.http
      .get(environment.baseUrl + '/_topic_data.php')
      .subscribe((res: any) => {
        console.log('topic: ', res);
        this.topic_list = res.data;
      });
  }

  fetchTopicDone(meeting_code: any) {
    this.http
      .get(environment.baseUrl + '/_meetingtopic_data.php?meeting_code=' + meeting_code)
      .subscribe((res: any) => {
        console.log('meeting topic: ', res);
        this.topic_done = res.data;
      });
  }

  addMeetingTopic(item: any) {
    this.topics.topic_done = item;
    this.topics.meeting_code = '8';
    console.log('meeting add', this.topics);
    this.http.post(environment.baseUrl + '/_meetingtopic_add.php', this.topics).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          //
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }

  // Add and Remove Topic.
  saveTopic(item: any) {
    this.topics = item;
    console.log('save meeting', this.topics);
    this.http.post(environment.baseUrl + '/_topic_save.php', this.topics).subscribe(
      (response: any) => {
        console.log('response: ', response);
        if (response.status == 'Ok') {
          //
        }
      },
      (error) => {

        console.log('Error adduser: ', error);
      }
    );
  }
}
