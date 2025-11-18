// Format numbers with commas
export const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
}

// Calculate progress percentage
export const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100)
}

// Format date
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Generate unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}