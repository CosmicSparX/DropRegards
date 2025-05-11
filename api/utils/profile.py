import hashlib

def get_placeholder_image(username):
    """
    Generate a unique placeholder image URL based on username
    Uses initials-based avatars with a consistent color based on the username hash
    
    Args:
        username (str): The username to generate a placeholder for
        
    Returns:
        str: URL for a placeholder avatar
    """
    # Create a hash of the username to get a consistent color
    hash_object = hashlib.md5(username.encode())
    hash_hex = hash_object.hexdigest()
    
    # Get first two characters as initials (or first character if username is single character)
    initials = username[0].upper()
    if len(username) > 1:
        initials += username[1].upper()
    
    # Use UI Avatars service for placeholder image
    # We can replace this with our own service later if needed
    base_url = "https://ui-avatars.com/api/"
    params = [
        f"name={initials}",
        f"background={hash_hex[:6]}",  # Use first 6 chars of hash as color
        "color=ffffff",                 # White text
        "size=256",                     # Image size
        "bold=true",                    # Bold text
        "format=png"                    # Image format
    ]
    
    return f"{base_url}?{'&'.join(params)}"

def get_profile_image(user):
    """
    Get a profile image URL for a user, using a placeholder if none exists
    
    Args:
        user (dict): User object with username and profileImage fields
        
    Returns:
        str: Profile image URL (user's image or placeholder)
    """
    if not user or 'username' not in user:
        return get_placeholder_image("user")
        
    # If user has a profile image, use it
    if user.get('profileImage'):
        return user['profileImage']
    
    # Otherwise, generate a placeholder based on username
    return get_placeholder_image(user['username']) 