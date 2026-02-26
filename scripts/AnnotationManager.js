class AnnotationManager extends TimeManagerListener {
  constructor(timeManager) {
    super();

    this.timeManager = timeManager;

    let annotationsSection = document.getElementById('annotations-section');

    let scrollerDiv = document.createElement('div');
    scrollerDiv.id = 'annotations-scroller';
    scrollerDiv.classList.add('scroller-area');
    annotationsSection.appendChild(scrollerDiv);

    for (const annotation of annotations) {
      console.log(annotation);
      let annotationDiv = document.createElement("div");
      annotationDiv.classList.add("annotation");

      let timeStampDiv = document.createElement("div");
      timeStampDiv.classList.add("annotation-time-stamp");
      timeStampDiv.innerText = this.getStringForTimestamp(annotation);
      annotationDiv.appendChild(timeStampDiv);

      let annotationTextDiv = document.createElement("div");
      annotationTextDiv.classList.add("annotation-text");
      annotationTextDiv.innerText = annotation.annotation;
      annotationDiv.appendChild(annotationTextDiv);

      annotationDiv.onclick = () => {
        timeManager.goToTime(annotation.act, annotation.measure_range[0], 1);
      }

      scrollerDiv.appendChild(annotationDiv);
    }
  }

  getStringForTimestamp(annotation) {
    return 'Act ' + annotation.act + ', scene ' +
      this.timeManager.getScene(annotation.act, annotation.measure_range[0]) +
      ', measures ' + annotation.measure_range[0] + '–' + annotation.measure_range[1];
  }

  timeUpdated(scoreTime) {
    let annotationDivs = document.getElementById('annotations-scroller').children;
    for (let i = 0; i < annotationDivs.length; i++) {
      if ((annotations[i].act === scoreTime.act) &&
        (annotations[i].measure_range[0] <= scoreTime.bar) &&
      (annotations[i].measure_range[1] >= scoreTime.bar)) {
        annotationDivs[i].classList.add("current-annotation");
        annotationDivs[i].scrollIntoView();
      } else {
        annotationDivs[i].classList.remove("current-annotation");
      }
    }
  }
}