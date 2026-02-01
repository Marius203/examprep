import { Snackbar } from 'react-native-paper';
import React from 'react';

let snackbarRef = null;

export const setSnackbarRef = (ref) => {
    snackbarRef = ref;
};

export const showToast = (message, duration = 3000) => {
    if (snackbarRef) {
        snackbarRef.show(message, duration);
    } else {
        console.warn('Toast: Snackbar ref not set, message:', message);
    }
};

export class ToastProvider extends React.Component {
    state = {
        visible: false,
        message: '',
    };

    componentDidMount() {
        setSnackbarRef(this);
    }

    show = (message, duration = 3000) => {
        this.setState({ visible: true, message });
        setTimeout(() => {
            this.setState({ visible: false });
        }, duration);
    };

    render() {
        return (
            <Snackbar
                visible={this.state.visible}
                onDismiss={() => this.setState({ visible: false })}
                duration={3000}
                style={{ backgroundColor: '#333' }}
            >
                {this.state.message}
            </Snackbar>
        );
    }
}
