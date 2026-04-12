import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
          <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-red-600">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
            <p className="mb-6 text-gray-600">We're sorry, but something unexpected happened. Please try again.</p>
            
            {this.state.error && (
              <div className="p-3 mb-4 text-left bg-gray-100 rounded">
                <p className="font-mono text-sm text-red-600">{this.state.error.toString()}</p>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 text-white transition-colors bg-gray-900 rounded-lg hover:bg-red-600"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary


// build an ecommerce webapp for selling african wears for women, men and children of different ages called Aromo-Mit and also wrest beads for both men and women where users can login/sign up before making an order. use insforge as the backend and insforge MCP for user management, authentication. and make the admin be able to add product to the webapp from the backend and also add an assistant admin who is able to view the most of the activities but cannot delete the admin. only the main admin can be able to delete users.  also add the following Key Features:

// User authentication with role-based access (main_admin, sub_admin, customer)
// Shopping cart with per-user persistence via LocalStorage
// Product catalog with multiple categories
// Admin dashboard with order, product, customer, and settings management
// Floating AI chat for customer support., Stripe integration for secure card payments.