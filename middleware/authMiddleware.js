const JWT = require('jsonwebtoken');

/**
 * Middleware to verify JWT and authenticate the user.
 * @route Protected routes.
 * @returns {Object} Success or error response based on authentication.
 */
module.exports = async (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is required.",
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token is required.",
      });
    }

    // Verify the token using JWT_SECRET
    JWT.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized access, invalid token.",
        });
      } 

      // Store decoded user ID in request object for future use
      req.user = { id: decode.id };
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};
