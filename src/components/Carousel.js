import React, { Component } from "react";
import Slider from "react-slick";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import beach from "../img/beach.jpg";
import resort from "../img/resort.jpg";
import camp from "../img/camp.jpg";
import mountain from "../img/mountain.jpg";
import gulp from "../img/gulp.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from "reactstrap";

const items = [
  {
    src: resort,
    altText: "Slide 1",
    caption: "Resorts"
  },
  {
    src: gulp,
    altText: "Slide 2",
    caption: "Rock Climbing"
  },
  {
    src: camp,
    altText: "Slide 3",
    caption: "Camping"
  },
  {
    src: beach,
    altText: "Slide 4",
    caption: "Beach"
  },
  {
    src: mountain,
    altText: "Slide 5",
    caption: "Mountain Climbing"
  }
];

class MainCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }


    // const slides = items.map(item => {
    //   return (
    //     <CarouselItem
    //       onExiting={this.onExiting}
    //       onExited={this.onExited}
    //       key={item.src}
    //     >
    //       <img src={item.src} alt={item.altText} className="img-carousel" />
    //       <CarouselCaption
    //         captionText={item.altText}
    //         captionHeader={item.caption}
    //       />
    //     </CarouselItem>
    //   );
    // });

    // const card_slides = items.map(item => {
    //   return (
    //     <Card>
    //       <CardBody>
    //         <CardTitle tag="h5">{item.caption}</CardTitle>
    //         <CardText>{item.altText}</CardText>
    //       </CardBody>
    //     </Card>
    //   );
    // });

  render() {
    const { activeIndex } = this.state;

    const card_slides = items.map((item, idx) => {
      return (
        <Card key={`Key-${idx}`} className="card-item">
          <CardBody>
            <CardTitle tag="h5">{item.caption}</CardTitle>
            <CardText>{item.altText}</CardText>
          </CardBody>
        </Card>
      );
    });

    // const card_divs = items.map(item => {
    //   return (
    //     <div className="card-item" key={item.src}>
    //       <div className="card-body">
    //         <h5>{item.caption}</h5>
    //         <p>{item.altText}</p>
    //       </div>
    //     </div>
    //   );
    // });

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };

    return (
      <div className="slider-container">
        <Slider {...settings}>
          {card_slides}
        </Slider>
      </div>
      // <Carousel
      //   activeIndex={activeIndex}
      //   next={this.next}
      //   previous={this.previous}
      // >
      //   <CarouselIndicators
      //     items={items}
      //     activeIndex={activeIndex}
      //     onClickHandler={this.goToIndex}
      //   />
      //   {slides}
      //   <CarouselControl
      //     direction="prev"
      //     directionText="Previous"
      //     onClickHandler={this.previous}
      //   />
      //   <CarouselControl
      //     direction="next"
      //     directionText="Next"
      //     onClickHandler={this.next}
      //   />
      // </Carousel>
    );
  }
}

export default MainCarousel;
