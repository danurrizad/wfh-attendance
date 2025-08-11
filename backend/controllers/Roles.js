import db from "../utils/db.js";

export const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const q = req.query.q || '';
    const offset = (page - 1) * limit;
    let binds = {}

    // Base query for counting data
    let baseQuery = `FROM ROLES`;

    // Add search condition q
    let whereClause = '';
    if (q) {
        whereClause = `WHERE LOWER(ROLENAME) LIKE '%' || LOWER(:q) || '%'`;
        binds.q = q
    }

    // Get the total count data
    const totalRowsResult = await db.execute(`
        SELECT COUNT(*) AS TOTAL_ROWS
        ${baseQuery}
        ${whereClause}
    `,  binds );
    const totalRows = totalRowsResult.rows[0].TOTAL_ROWS;
    const totalPages = Math.ceil(totalRows / limit);

    // Fetch the paginated data
    binds.offset = offset
    binds.limit = limit
    const foundRoles = await db.execute(`
        SELECT *
        ${baseQuery}
        ${whereClause}
        ORDER BY ID
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `,  binds );

    if (foundRoles.rows.length === 0) {
        return res.status(404).json({ message: "No data roles found!" });
    }

    res.status(200).json({ 
      message: "All roles found!", 
      data: foundRoles.rows,
      pagination: {
          page: page,
          limit: limit,
          totalPage: totalPages,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error: error });
  }
};

export const createRole = async (req, res) => {
  try {
    // Get body
    const { roleName } = req.body;
    
    // Check if body exist
    if (!roleName) {
      return res.status(400).json({ message: "Role name can't be empty!" });
    }
    
    // Check if role exist
    const existingRole = await db.execute(
      "SELECT * FROM ROLES WHERE rolename = :roleName",
      { roleName: roleName }
    );
    if (existingRole.rows.length > 0) {
      return res.status(400).json({ message: `Role with name ${roleName} already exists!` });
    }
    
    // Query insert
    await db.execute("INSERT INTO ROLES (rolename) values(:roleName)", { roleName: roleName});

    res.status(201).json({ message: "Role created!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error: error });
  }
};

export const getRoleById = async (req, res) => {
    // Get params
    const { id } = req.params;
    
    // Check if params exist
    if (!id) {
        return res.status(400).json({ message: "ID not found!" });
    }
    
    // Check if role exist
    const foundRole = await db.execute("SELECT * FROM ROLES WHERE id = :id ", {
        id: id
    });
    if (foundRole.rows.length === 0) {
        return res.status(404).json({ message: "Role not found!" });
    }

    res.status(200).json({ message: "Role found!", data: foundRole.rows });
};

export const updateRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    // Check params and body 
    if (!id) {
      return res.status(404).json({ message: "ID not found!" });
    }
    if (!roleName) {
      return res.status(400).json({ message: "Please provide rolename!" });
    }

    // Check if role exist
    const foundRole = await db.execute("SELECT * FROM ROLES WHERE ID = :id", {
        id: id
    });
    if (foundRole.rows.length === 0) {
      return res.status(404).json({ message: "Failed to update. Role not found!" });
    }

    // Check if current name and updated is same
    const currentName = foundRole.rows[0].ROLENAME
    if(currentName === roleName){
        return res.status(400).json({ message: "Can't update with the same name!"})
    }
    
    // Execute update
    const updatedResult = await db.execute(
        "UPDATE ROLES SET ROLENAME = :rolename WHERE ID = :id", 
        {
            roleName: roleName,
            id: id
        }
    ) 
    if(updatedResult.rowsAffected === 0){
        return res.status(400).json({ message: "Changes failed!"})
    }
    res.status(200).json({ message: "Role updated!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error: error });
  }
};

export const deleteRoleById = async(req, res) => {
    try {
        // Get and check params
        const { id } = req.params
        const currentRoleId = req.user.role_id
        console.log("Current roleId:", currentRoleId)
        if(!id){
            return res.status(404).json({ message: "ID not found!"})
        }

        // Check if current role is going to be deleted
        if(currentRoleId === id){
          return res.status(400).json({ message: "Can't delete a role that you're using now"})
        }

        // Execute query delete
        const deleted = await db.execute(
            "DELETE FROM ROLES WHERE ID = :id",
            { id: id }
        )
        if(deleted.rowsAffected === 0){
            return res.status(400).json({ message: `Delete Failed!`})
        }
        res.status(200).json({ message: `Role deleted!` })
    } catch (error) {
      console.log("ERROR", error)
        res.status(500).json({ message: "Internal server error!", error: error });
    }
}
