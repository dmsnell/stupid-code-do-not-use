<?php

function go() {
    // $post_id = 80426; // default layout
    $post_id = 81228; // with sidebar
    // $post_id = 81315; // MVP
    $template    = get_post( $post_id );

    return implode( PHP_EOL, [
        '<link href="https://s1.wp.com/_static/??-eJyFkllywyAMhi9UQtNpPH3p9CyAlVgJ2yBR17cvwY4zzUJfPJL4P2uVYxQmeAbP0mURbT6gJzlGE5wghxamG29jiF7kY4yyJpMwMobi7YO1YWzph/ANSeistYVC82RhlaM3NvclXAKyVzRg+QFtHPp7yZEkl/eTDj+r0cpr8XSmgKMyJ1G9ltyEBIIHcEDl2UXFkseimTx6YADfgnvQ+SC0SnMjF+8OuehrHuHA5wpc3VYS9Hv0yNNqPBkjEkttQ21aJ5WmZegPp/qEqBX9IR4UpPoiqF3Px7P6M4TSB64LXY1/F7BMvigc9KjAljI8tzAXuwt1Noey7GaauVStYwIiUb4Os1sWf8fNYRmzvjmG6x1/uc/tbvf+9vrRddvjL0e9SZ4=?cssminify=yes" rel="stylesheet">',
        do_blocks( $template->post_content ),
        '<div style="width: 100%;">Automattic</div>'
    ] );
}

echo go();
