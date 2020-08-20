import {
    LitElement,
    html,
    css,
    customElement,
    PropertyValues, property
} from 'lit-element';

import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';
import '@vaadin/vaadin-button';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {DetectedObject, ObjectDetection} from '@tensorflow-models/coco-ssd';

@customElement('cat-view')
export class CatView extends LitElement {
  static get styles() {
    return css`
            .size {
                height: 400px;
                width: 535px;
            }
            .center {
                align-items: center;
            }
    `;
  }
    @property({type : Boolean})
    private catFound = false;
    @property({type : Boolean})
    private dogFound = false;
    @property({type : Boolean})
    private personFound = false;

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        cocoSsd.load().then((loadedModel: ObjectDetection) => this.setModel(loadedModel));

    }

    predictWebcam(loadedModel: ObjectDetection) {
        const video = this.shadowRoot?.getElementById("camera") as HTMLVideoElement;
        loadedModel.detect(video).then((predictions) => this.managePredictions(predictions, loadedModel))
    }
  render() {
    return html`
      <vaadin-vertical-layout class="center">
      <div>
      <video
          class="size"
          autoPlay
          playsInline
          muted id="camera"
        />
      <canvas id="canvas" class="size">
      </canvas>
      </div>
        <vaadin-horizontal-layout theme="spacing">
            <vaadin-button ?disabled=${!this.catFound} @click="${this.takePicture}">Take a picture of the cat</vaadin-button>
            <vaadin-button ?disabled=${!this.personFound} @click="${this.takePicture}">Take a picture of the person</vaadin-button>
            <vaadin-button ?disabled=${!this.dogFound} @click="${this.takePicture}">Take a picture of the dog</vaadin-button>
        </vaadin-horizontal-layout>
          <div class="output">
            <img id="photo" class="size">
          </div>
      </vaadin-vertical-layout>
    `;
  }

    private setModel(loadedModel: ObjectDetection) {
        const video = this.shadowRoot?.getElementById("camera") as HTMLVideoElement;
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: "user"
                }
            })
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play()
                }
                video.addEventListener('loadeddata', () => this.predictWebcam(loadedModel));
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }

    private managePredictions(predictions: DetectedObject[], loadedModel: ObjectDetection) {
        var catFound = false;
        var dogFound = false;
        var personFound = false;
        // Remove any highlighting we did previous frame.
        for (let n = 0; n < predictions.length; n++) {
            // If we are over 75% sure we are sure we classified it right, draw it!
            if (predictions[n].score > 0.75) {
                if (predictions[n].class === "cat") {
                    catFound = true;
                }
                if (predictions[n].class === "dog") {
                    dogFound = true;
                }
                if (predictions[n].class === "person") {
                    personFound = true;
                }
               // debugger;
            }
        }
        if (catFound && !this.catFound) {
            // new cat
            const snd = new Audio("./sound/cat.mp3");
            snd.play();
            this.catFound = true;
        }

        if (!catFound && this.catFound) {
            // cat out
            const snd = new Audio("./sound/out.mp3");
            snd.play();
            this.catFound = false;
        }

        if (dogFound && !this.dogFound) {
            // new cat
            const snd = new Audio("./sound/dog.mp3");
            snd.play();
            this.dogFound = true;
        }

        if (!dogFound && this.dogFound) {
            // cat out
            const snd = new Audio("./sound/out.mp3");
            snd.play();
            this.dogFound = false;
        }
        if (personFound && !this.personFound) {
            // new person
            const snd = new Audio("./sound/in.mp3");
            snd.play();
            this.personFound = true;
        }

        if (!personFound && this.personFound) {
            // cat out
            const snd = new Audio("./sound/out.mp3");
            snd.play();
            this.personFound = false;
        }
        window.setTimeout(() => this.predictWebcam(loadedModel), 1000);
        // Call this function again to keep predicting when the browser is ready.
        // window.requestAnimationFrame(() => this.predictWebcam(loadedModel) );
    }

    private takePicture() {
        const canvas = this.shadowRoot?.getElementById("canvas") as HTMLCanvasElement;
        const video = this.shadowRoot?.getElementById("camera") as HTMLVideoElement;
        const photo = this.shadowRoot?.getElementById("photo") as HTMLImageElement;
        var context = canvas.getContext('2d');
        context!.drawImage(video, 0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.src = data;
    }
}