$(document).ready( function()
{
    // global constants
    const getip_url = 'http://ip-api.com/json';
    const valid_cmds = ['clear', 'ls', 'cd', 'cat', 'help'];

    $.get(getip_url, function (data)
        {
            /**
            This function is used for getting client data to display.

            */

            $('.content').prepend('<p id="guest-connection">' + 
                'Guest connected as ' + data.query + ' from ' + data.regionName + '...'
            );
        }, 'json');

    // page init
    $('.content').prepend('<pre>' + help_txt);
    let path = cur_dir()

    // init input event
    let input = document.getElementById('command-line');
    input.addEventListener('keypress', command_line_event);

    document.addEventListener('mouseup', () =>
    {
        /**
        This function is used for copying highlighted text and for focusing
        the last input when clicked on the page.

        */

        // get last #command-line to focus it
        const command_lines = document.querySelectorAll("#command-line");
        const last_cmd_line = command_lines[command_lines.length - 1];
        console.log(last_cmd_line);

        // copy highlighted text and focus #command-line
        document.execCommand('copy');
        $(last_cmd_line).focus();
    }, true);

    function cur_dir()
    {
        /**
        This function is used for getting what directory the client is
        currently in for a various amount of uses.

        */

        let path = document.querySelectorAll("#path");
        try
        {
            path = path[path.length - 1].innerHTML.split('/')[1].slice(0, -1);
        }
        catch(err)
        {
            if (err.name === 'TypeError') // this is okay since we can't slice '/' for the home dir
            {
                path = '~'
            }
            else
            {
                console.log(err);
            }
        }

        return path;
    }

    function command_line_event (event)
    {
        /**
        This function is used for handling client input to $command-line.

        */
        if (event.keyCode === 13)
        {
            // settings
            const command = input.value.split(' ');
            const command_prefix = command[0];
            const command_suffix = command[1];
            event.preventDefault();
            $('input').prop('disabled', true);

            // check if valid_cmds
            if (valid_cmds.includes(command_prefix))
            {
                if (command_prefix === valid_cmds[0]) // clear
                {
                    $(".content").empty();
                }
                else if (command_prefix === valid_cmds[1]) // ls
                {
                    path = cur_dir();
                    $('.content').append('<hr/>');
                    for (const key in file_tree[path])
                    {
                        val = file_tree[path][key]
                        if (val === 'DIR')
                        {
                            $('.content').append('<p class="ls-out" id="ls-dir">' + key + '/');
                        }
                        else if (val.slice(-4) === '.txt')
                        {
                            $('.content').append('<p class="ls-out">' + val);
                        }
                    }

                    if (path != '~')
                    {
                        path = '~/' + path;
                    }
                }                
                else if (command_prefix === valid_cmds[2]) // cd
                {
                    path = cur_dir();

                    if (command_suffix == undefined)
                    {
                        path = '~';
                    }
                    else if (command_suffix === '.')
                    {
                        if (path === '~'){}
                        else
                        {
                            path = '~/' + path;
                        }
                        
                    }
                    else if (command_suffix === '..')
                    {
                        if (path === '~'){}
                        else
                        {
                            path = file_tree[path].PARENT_DIR
                        }
                    }
                    else
                    {
                        try
                        {
                            check_if_dir = file_tree[path][command_suffix]
                            if (check_if_dir === 'DIR')
                            {
                                path = '~/' + command_suffix;
                            }
                            else
                            {
                                path = cur_dir();
                                throw new Error('Not a directory.');
                            }
                        }
                        catch(err)
                        {
                            $('.content').append('<p>' + command_prefix + ': ' + command_suffix + ': No such file or directory.');
                        }
                    }
                }
                else if (command_prefix === valid_cmds[3]) // cat
                {
                    if (command_suffix == undefined || command_suffix === '')
                    {
                        console.log('no file input');
                    }
                    else
                    {
                        path = cur_dir();
                        let available_txts = [];
    
                        for (const key in file_tree[path])
                        {
                            const val = file_tree[path][key];
                            if (val.slice(-4) === '.txt')
                            {
                                available_txts.push(val);
                            }                            
                        }
                        
                        if (available_txts.includes(command_suffix))
                        {
                            const file = command_suffix.replace(/\./g, '_')
                            $('.content').append('<pre>' + eval(file));
                        }
                        else
                        {
                            $('.content').append('<p>' + command_prefix + ': ' + command_suffix + ': No such file.');
                        }
    
                        if (path != '~')
                        {
                            path = '~/' + path;
                        }
                    }
                }
                else if (command_prefix === valid_cmds[4]) // help
                {
                    $('.content').append('<pre>' + help_txt);
                }
            }
            else
            {
                console.log(command_prefix)
                if (command_prefix === ''){}
                else
                {
                    $('.content').append('<p>' + command_prefix + ': command not found');
                }
            }

            // add new contents
            $('.content').append('<hr/>');
            if (command_prefix === '')
            {
                if (cur_dir() != '~')
                {
                    $('.content').append('<p class="terminal" id="path">guest@vijaystroup.com:~/' + cur_dir() + '$');
                }
                else
                {
                    $('.content').append('<p class="terminal" id="path">guest@vijaystroup.com:' + cur_dir() + '$');
                }
            }
            else
            {
                $('.content').append('<p class="terminal" id="path">guest@vijaystroup.com:' + path + '$');
            }
            $('.content').append('<input type="text" class="terminal" id="command-line" spellcheck="false">');

            // add event listener to new input and focus it
            input = document.querySelectorAll("#command-line:last-child")[0];
            input.addEventListener('keypress', command_line_event);
            $(input).focus();
        }
    }
});
