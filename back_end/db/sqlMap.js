var sqlMap = {
    user: {
        add: 'insert into user (account, email, password) values (?,?,?)',
        select: 'select * from user',
    },
    task: {
        alltask: 'select * from task',
        inserttask: 'insert into task (task_id, account, name, tagged) values (?,?,?,false)',
        update: "update task set tagged = true where task_id = ? ",
    },
    tag: {
        add: 'insert into tag (picture_id, tag) values (?,?)',
        select: 'select * from tag',
    }
}

module.exports = sqlMap