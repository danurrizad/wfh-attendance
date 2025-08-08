export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.rolename;

        if (!userRole) {
            return res.status(403).json({ message: "Access denied. Role not specified!" });
        }

        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized. Access denied!" });
        }
    };
};
