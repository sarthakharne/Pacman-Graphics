The game can directly be played on any server setup with this as the home directory. To make this process easy, I used the vscode liverserver extension: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer which can be installed by
```
ext install ritwickdey.LiveServer
```

The following are the controls:
- Arrow Keys can be used to move the pacman in that particular canonical direction
- '(' and ')' can be used to rotate pacman in its place by an angle of -45 and +45 degrees respectively
- '[' and ']' can be used to rotate the maze about its center by an angle of -90 and +90 degrees respectively. In this new orientation, the arrow keys can be used to conrol movements of the pacman as per their canonical meaning
- 'c' can be used to cycle through the maze configurations, a maze configuration is reset once it is cycled out off of
- 'm' can be used to toggle the modify mode on and off, this is indicated by a change of background color.

In the modify mode:
- The pacman can be clicked only if the grid in which it sits in is clicked (mouse left click)
- Once picked, the pacman shall follow the mouse hover position
- After picking if an accessible location is chosen as a drop location (by clicking on that particular grid location) the pacman is dropped at this new location. If the location is inaccessible, then the pacman goes back to its original poistion.
- Press 'm' again to toggle out of the modify mode
- If 'm' is pressed after the pacman is picked (before dropping it), it goes back to its original position.

Something to note:
- If the pacman is on a power pellet, the rotation of the maze and rotation in place is forbidden. However, modify mode can still be toggled on and off when on a power pellet.
