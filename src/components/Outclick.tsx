import * as React from "react";

interface OutclickProps {
    children?: React.ReactNode;
    callback?: () => void;
}

interface OutclickStates {
    children: React.ReactNode;
}

class Outclick extends React.Component<OutclickProps, OutclickStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            children: this.GenNewChildren()
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.HandleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.HandleClickOutside, true);
    }

    elements: React.MutableRefObject<any>[] = [];

    componentDidUpdate(prevProps: Readonly<OutclickProps>) {
        if (prevProps !== this.props)
            this.setState({ ...this.state, children: this.GenNewChildren() })
    }

    GenNewChildren = () => {
        this.elements = [];
        return React.Children.toArray(this.props.children).map((child: any) => {
            const elementRef = React.createRef();
            let component = React.cloneElement(child, { ref: elementRef })
            this.elements.push(elementRef)
            return component
        })
    }

    HandleClickOutside = (event: any) => {
        let outClickElements = 0;
        this.elements.forEach(element => {
            if (!element.current.contains(event.target))
                outClickElements++;
        });
        if (this.elements.length <= outClickElements && this.props.callback)
            this.props.callback()
    }

    render() {
        return <>{this.state.children}</>
    }
}

export default Outclick