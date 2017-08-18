import React from 'react';
import styles from './Create.css';

import Canvas from './Canvas/Canvas.jsx';
import Palette from './Palette/Palette.jsx';
import Overlay from './Overlay/Overlay.jsx';
import SaveDialog from './SaveDialog/SaveDialog.jsx';

import { patterns, exteriors, figures } from '../../../data/parts.json';

export default class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 3,
            isDragging: false,
            lastStepSeen: 1,
            saving: false,
            title: [],
            city: [],
            email: [],
            objects: {
                pattern: null,
                exterior: null,
                figures: []
            }
        };
    }

    getPaletteData(step) {
        let title;
        let data;
        let add;

        switch (step) {
            case 1:
                title = 'Chosse a pattern';
                data = patterns;
                add = this.setPattern.bind(this);
                break;
            case 2:
                title = 'Choose an exterior';
                data = exteriors;
                add = this.setExterior.bind(this);
                break;
            case 3:
                title = 'Drag figures to the canvas';
                data = figures;
                add = this.addFigure.bind(this);
                break;
        }

        return { title, data, add };
    }

    canContinue(step) {
        if (step === 1 && this.state.objects.pattern) return true;
        if (step === 2 && this.state.objects.exterior) return true;
        if (step === 3 && this.state.objects.figures.length > 0) return true;
        return false;
    }

    setPattern({ src }) {
        this.setState({
            objects: {
                ...this.state.objects,
                pattern: src
            }
        });
    }

    setExterior({ src }) {
        this.setState({
            objects: {
                ...this.state.objects,
                exterior: src
            }
        });
    }

    addFigure(d) {
        this.setState({
            objects: {
                ...this.state.objects,
                figures: [...this.state.objects.figures, d]
            }
        });
    }

    updateFigure(index, payload) {
        const objects = this.state.objects;

        objects.figures[index] = {
            ...objects.figures[index],
            ...payload
        };

        this.setState({
            objects
        });
    }

    removeFigure(index) {
        const objects = this.state.objects;
        objects.figures.splice(index, 1);

        this.setState({
            objects: objects
        });
    }

    flipFigure(index) {
        const objects = this.state.objects;
        const figure = objects.figures[index];
        figure.flipped = !figure.flipped;

        this.setState({
            objects: objects
        });
    }

    nextStep(e) {
        if (this.state.step === 3) {
            this.setState({
                saving: true
            });

            return;
        }
        const newStep = this.state.step + 1;

        this.setState({
            step: newStep,
            lastStepSeen: Math.max(newStep, this.state.lastStepSeen)
        });
    }

    closeDialog() {
        this.setState({
            saving: false
        });
    }

    setDragStatus(status = false) {
        this.setState({
            ...this.state,
            isDragging: status
        });
    }

    appendCharacterToTitle(title, char) {
        const t = this.state[title];
        if (t.lengh > 24) return;

        t.push(char);

        this.setState({
            [title]: t
        });
    }

    popCharacterFromTitle(title) {
        const t = this.state[title];
        if (t.length > 254) return;
        t.pop();

        this.setState({
            [title]: t
        });
    }

    save() {
        alert('not yet implemented');
    }

    render() {
        const { title, data, add } = this.getPaletteData(this.state.step);

        return (
            <div className={styles.create}>
                <Canvas
                    objects={this.state.objects}
                    add={add}
                    updateFigure={this.updateFigure.bind(this)}
                    removeFigure={this.removeFigure.bind(this)}
                    flipFigure={this.flipFigure.bind(this)}
                    isDragging={this.state.isDragging}
                />
                <Palette
                    title={title}
                    d={data}
                    setDragStatus={this.setDragStatus.bind(this)}
                    continue={this.canContinue(this.state.step)}
                    nextStep={this.nextStep.bind(this)}
                />

                {this.state.saving
                    ? <Overlay>
                          <SaveDialog
                              title={this.state.title.join('')}
                              email={this.state.email.join('')}
                              closeDialog={this.closeDialog.bind(this)}
                              appendCharacterToTitle={this.appendCharacterToTitle.bind(
                                  this
                              )}
                              popCharacterFromTitle={this.popCharacterFromTitle.bind(
                                  this
                              )}
                              save={this.save.bind(this)}
                          />
                      </Overlay>
                    : null}
            </div>
        );
    }
}
