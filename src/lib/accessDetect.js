
export const accessDetect = (adminData, target) => {
    let foundItem = null;
    adminData.forEach((item) => {
        if (item.children.length > 0) {
            if (item.MT_Name === target) {
                foundItem = item;
            } else if (!foundItem) {
                foundItem = accessDetect(item.children, target);
            }
        } else {
            if (item.MT_Name === target) {
                foundItem = item;
            }
        }
    });
    return foundItem;
}
